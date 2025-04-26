package com.fiiconnect.api.social_secretary;

import org.springframework.stereotype.Controller;

import java.util.HashMap;
import java.util.Map;

@Controller
public class Emoji {
    Map<String,String> emoji = new HashMap<>();


    public Emoji() {
        emoji.put("--smiley--",new String(Character.toChars(0x1F603)));
        emoji.put("--disappointed--",new String(Character.toChars(0x1F614)));
        emoji.put("--angry--",new String(Character.toChars(0x1F621)));
        emoji.put("--scared--",new String(Character.toChars(0x1F631)));
        emoji.put("--wink--",new String(Character.toChars(0x1F609)));
    }

    public String getEmojiByCode(String code) {
        return emoji.get(code);
    }


    public String[] getEmojiCodes(){
        return emoji.keySet().toArray(new String[0]);
    }



}
