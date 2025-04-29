package com.fiiconnect.api.modulexemplu;

import java.math.BigInteger;

public class IbanValidator {

    public static boolean isValid(String iban) {
        if (iban == null) {
            return false;
        }

        iban = iban.replaceAll("\\s+", "");
        if (iban.length() < 15 || iban.length() > 34) {
            return false;
        }

        String rearranged = iban.substring(4) + iban.substring(0, 4);

        StringBuilder numericIban = new StringBuilder();
        for (char ch : rearranged.toCharArray()) {
            if (Character.isDigit(ch)) {
                numericIban.append(ch);
            } else if (Character.isLetter(ch)) {
                numericIban.append(Character.getNumericValue(ch));
            } else {
                return false;
            }
        }

        BigInteger ibanNumber = new BigInteger(numericIban.toString());
        return ibanNumber.mod(BigInteger.valueOf(97)).intValue() == 1;
    }
}
