package org.entando.plugins.pda;

import static org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration.CONFIG_REST_TEMPLATE;

import org.entando.connectionconfigconnector.config.ConnectionConfigConfiguration;
import org.entando.connectionconfigconnector.service.ConnectionConfigConnector;
import org.entando.connectionconfigconnector.service.impl.ConnectionConfigConnectorImpl;
import org.entando.connectionconfigconnector.service.impl.InMemoryConnectionConfigConnector;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RootUriTemplateHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@ComponentScan("org.entando")
@Import(ConnectionConfigConfiguration.class)
@SuppressWarnings("PMD.UseUtilityClass")
public class EntandoPdaPluginJavaApplication {

    @Value("${pda.mock-connection-config}")
    private boolean mockConnectionConfig;

    @SuppressWarnings("PMD.DefaultPackage")
    @Value("${pda.allowed-origins-dev}")
    String allowedOriginsDev;

    public static void main(final String[] args) {
        SpringApplication.run(EntandoPdaPluginJavaApplication.class, args);
    }

    @Bean
    public ConnectionConfigConnector connectionConfigConnector(ConnectionConfigConnectorImpl connectionConfigImpl) {
        if (mockConnectionConfig) {
            return new InMemoryConnectionConfigConnector();
        }
        return connectionConfigImpl;
    }

    @Bean
    @Profile("dev")
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(allowedOriginsDev)
                        .allowedMethods("*")
                        .allowCredentials(true);
            }
        };
    }

    @Bean
    @Qualifier(CONFIG_REST_TEMPLATE)
    @Primary
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        RootUriTemplateHandler.addTo(restTemplate, "http://localhost:8084");
        return restTemplate;
    }
}
