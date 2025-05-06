package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.TeachingController;
import com.fiiconnect.api.didactic.models.Teaching;
import com.fiiconnect.api.didactic.models.TeachingCompositeKey;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.services.TeachingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TeachingControllerTest {

    @Mock
    private TeachingRepository teachingRepository;

    @Mock
    private TeachingService teachingService;

    @InjectMocks
    private TeachingController teachingController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(teachingController).build();
    }

    @Test
    void testAddTeaching() throws Exception {
        TeachingCompositeKey key = new TeachingCompositeKey(1L, 2L);
        Teaching teaching = new Teaching();
        teaching.setId(key);
        teaching.setRole("Titular");

        mockMvc.perform(post("/didactic/teach")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(teaching)))
                .andExpect(status().isOk());

        verify(teachingRepository, times(1)).save(any(Teaching.class));
    }

    @Test
    void testDeleteTeaching() throws Exception {
        mockMvc.perform(delete("/didactic/teach")
                        .param("idProf", "1")
                        .param("idCourse", "2"))
                .andExpect(status().isOk());

        TeachingCompositeKey key = new TeachingCompositeKey(1L, 2L);
        verify(teachingRepository, times(1)).deleteById(eq(key));
    }
}

