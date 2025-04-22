package com.fiiconnect.api.didactic.helpers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class SQLExceptionMessageParser {
    @Autowired
    private DatabaseCredentials credentials;

    public String getConstraintName(String message)
    {
        //keep only first line of error message
        message = message.substring(0, message.indexOf("\n"));
        if(message.contains("cannot insert NULL into"))
        {
            //message doesn't include constraint name so have to rebuild it
            //format is: ... cannot insert NULL into ("username"."table"."column") ...
            String tableName = message.substring(message.indexOf(credentials.getUsername().toUpperCase()));
            tableName = tableName.substring(tableName.indexOf(".")+2);
            tableName = tableName.substring(0, tableName.indexOf("\""));
            String columnName = message.substring(message.lastIndexOf(".")+2);
            columnName = columnName.substring(0, columnName.indexOf("\""));

            return "C_" + tableName + "_NN_" + columnName;
        }
        else if(!message.contains("constraint"))
            return null; //not a constraint error

        message = message.substring(message.indexOf(credentials.getUsername().toUpperCase()));
        message = message.substring(message.indexOf(".")+1);
        message = message.substring(0, message.indexOf(")"));

        return message;
    }
}
