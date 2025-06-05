package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.social_secretary.DTO.ChannelDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.Channel;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.repository.ChannelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ChannelService {
    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    TagService tagService;

    public List<Channel> getAllChannels() {
        return channelRepository.findAll();
    }

    public Channel saveChannel(ChannelDTO channelDTO) {
        Set<TagDTO> tagDTOS= channelDTO.getTags();
        Set<Tag> tags = new HashSet<>();

        for (TagDTO t : tagDTOS) {
            Tag existingTag = tagService.findByNameAndType(t.getName(), t.getType());
            if (existingTag == null) {
                System.out.println("Tag invalid: " + t.getName());
                return null;
            }

            tags.add(existingTag);
        }
        Channel channel = new Channel();
        channel.setName(channelDTO.getName());
        channel.setTags(tags);
        return channelRepository.save(channel);
    }

    public void deleteChannel(Long id) {
        channelRepository.deleteById(id);
    }

    public Channel updateChannel(Long id, ChannelDTO channelDTO) {
        Channel currentChannel = channelRepository.findById(id).orElse(null);
        if(currentChannel == null){
            System.out.println("id-ul curent nu exista");
            return null;
        }
        currentChannel.setName(channelDTO.getName());
        Set<TagDTO>tagDTOS = channelDTO.getTags();
        Set<Tag>tags = new HashSet<>();
        for(TagDTO t : tagDTOS){
            Tag currentTag= tagService.findByNameAndType(t.getName(),t.getType());
            if(currentTag!=null){
                tags.add(currentTag);
            }
        }
        currentChannel.getTags().clear();
        currentChannel.getTags().addAll(tags);
        return channelRepository.save(currentChannel);
    }

    public List<Channel> getAllChannelsWithTag(Long id) {
        return channelRepository.findAllChannelsWithTag(id);
    }


    public List<Channel> getAllChannelsWithTags(List<Long> tagIds) {
        Set<Channel> channels = new HashSet<>();
        for(Long id : tagIds) {
            channels.addAll(channelRepository.findAllChannelsWithTag(id));
        }
        return new ArrayList<>(channels);
    }
}
