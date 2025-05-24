package com.fiiconnect.api;

import org.junit.jupiter.api.Test;
import com.fiiconnect.api.social_secretary.enums.TagType;
import static org.junit.jupiter.api.Assertions.*;

class TagTypeTest {

    @Test
    void testEnumValues() {
        TagType[] values = TagType.values();

        // Verifică câte valori sunt
        assertEquals(5, values.length);

        // Verifică că fiecare valoare este prezentă
        assertTrue(containsValue(values, TagType.GENERAL));
        assertTrue(containsValue(values, TagType.MATERIE));
        assertTrue(containsValue(values, TagType.AN));
        assertTrue(containsValue(values, TagType.SEMINAR));
        assertTrue(containsValue(values, TagType.GRUPA));
    }

    // Metodă ajutătoare să vedem dacă un array conține o valoare
    private boolean containsValue(TagType[] values, TagType target) {
        for (TagType v : values) {
            if (v == target) return true;
        }
        return false;
    }
}
