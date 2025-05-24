package com.fiiconnect.api.social_secretary.controller;

import com.fiiconnect.api.social_secretary.DTO.ChannelDTO;
import com.fiiconnect.api.social_secretary.classes.Channel;
import com.fiiconnect.api.social_secretary.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/channel")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class ChannelController {
    @Autowired
    ChannelService channelService;

    //returneaza toate canalele existente
    @GetMapping
    public List<Channel> getAllChannels(){
        return channelService.getAllChannels();
    }

    private List<Channel> getAllChannelsWithTag(Long id){
        return channelService.getAllChannelsWithTag(id);
    }

    //returneaza toate channel-urile care au macar unul din tag-urile din lista de tag-ids
   /* @GetMapping("/with-tag")
    public List<Channel> getAllChannelsWithTags(@RequestParam List<Long> tagIds){
        Set<Channel> channels = new HashSet<>();
        for(Long id : tagIds){
            channels.addAll(getAllChannelsWithTag(id));
        }
        return channels.stream().toList();
    }

    */
    @GetMapping("/with-tags")
    public List<Channel> getAllChannelsWithTags(@RequestParam String tagIds) {
        List<Long> ids = Arrays.stream(tagIds.split(","))
                .map(Long::parseLong)
                .collect(Collectors.toList());

        // Use a Set to automatically remove duplicates
        Set<Channel> uniqueChannels = new HashSet<>(channelService.getAllChannelsWithTags(ids));

        return new ArrayList<>(uniqueChannels);
    }

    //adauga un canal in baza de date
    @PostMapping
    public Channel saveChannel(@RequestBody ChannelDTO channelDTO){
        return channelService.saveChannel(channelDTO);
    }

    //updateaza un canal conform id-ului dat si al continutului dat in body
    @PutMapping("/{id}")
    public Channel updateChannel(@PathVariable Long id, @RequestBody ChannelDTO channelDTO){
        return channelService.updateChannel(id,channelDTO);
    }

    //sterge un canal in functie de id-ul dat
    @DeleteMapping("/{id}")
    public void deleteChannel(@PathVariable Long id){
        channelService.deleteChannel(id);
    }
}
