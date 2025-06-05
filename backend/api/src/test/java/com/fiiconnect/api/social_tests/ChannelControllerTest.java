
// IntelliJ API Decompiler stub source generated from a class file
// Implementation of methods is not available

package com.fiiconnect.api.social_tests;

@org.junit.jupiter.api.extension.ExtendWith({org.mockito.junit.jupiter.MockitoExtension.class})
public class ChannelControllerTest {
    @org.mockito.Mock
    private com.fiiconnect.api.social_secretary.service.ChannelService channelService;
    @org.mockito.InjectMocks
    private com.fiiconnect.api.social_secretary.controller.ChannelController channelController;
    private com.fiiconnect.api.social_secretary.classes.Channel channel;
    private com.fiiconnect.api.social_secretary.DTO.ChannelDTO channelDTO;

    public ChannelControllerTest() { /* compiled code */ }

    @org.junit.jupiter.api.BeforeEach
    void setUp() { /* compiled code */ }

    @org.junit.jupiter.api.Test
    void getAllChannels_ReturnsList() { /* compiled code */ }

    @org.junit.jupiter.api.Test
    void getAllChannelsWithTags_ReturnsUniqueList() { /* compiled code */ }

    @org.junit.jupiter.api.Test
    void saveChannel_ReturnsCreatedChannel() { /* compiled code */ }

    @org.junit.jupiter.api.Test
    void updateChannel_ReturnsUpdatedChannel() { /* compiled code */ }

    @org.junit.jupiter.api.Test
    void deleteChannel_CallsServiceDelete() { /* compiled code */ }
}