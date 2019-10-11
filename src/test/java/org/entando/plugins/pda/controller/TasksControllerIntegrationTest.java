package org.entando.plugins.pda.controller;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.entando.plugins.pda.core.service.task.FakeTaskService;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

@AutoConfigureMockMvc
@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@TestExecutionListeners({DependencyInjectionTestExecutionListener.class})
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class TasksControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private RestTemplate restTemplate;

    @Before
    public void setup() {
        MockRestServiceServer mockServer = MockRestServiceServer.createServer(restTemplate);
        mockServer.expect(requestTo(containsString("/config/entando-process-driven-plugin")))
                .andExpect(method(HttpMethod.GET))
                .andRespond(
                        withSuccess(new ClassPathResource("mock_connection_configs.json"), MediaType.APPLICATION_JSON));
    }

    @Test
    public void testListTasks() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks"))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.size()", is(2)))
                .andExpect(jsonPath("payload[0].name", is(FakeTaskService.TASK_NAME_1)))
                .andExpect(jsonPath("payload[1].name", is(FakeTaskService.TASK_NAME_2)));
    }

    @Test
    public void testGetTask() throws Exception {
        mockMvc.perform(get("/connections/fakeProduction/tasks/" + FakeTaskService.TASK_ID_1))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.id", is(FakeTaskService.TASK_ID_1)))
                .andExpect(jsonPath("payload.name", is(FakeTaskService.TASK_NAME_1)));

        mockMvc.perform(get("/connections/fakeProduction/tasks/" + FakeTaskService.TASK_ID_2))
                .andDo(print()).andExpect(status().isOk())
                .andExpect(jsonPath("errors", hasSize(0)))
                .andExpect(jsonPath("payload.id", is(FakeTaskService.TASK_ID_2)))
                .andExpect(jsonPath("payload.name", is(FakeTaskService.TASK_NAME_2)));
    }
}