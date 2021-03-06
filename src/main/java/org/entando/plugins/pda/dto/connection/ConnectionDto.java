package org.entando.plugins.pda.dto.connection;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.entando.plugins.pda.core.engine.Connection;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConnectionDto {
    private String name;

    private String url;

    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Builder.Default
    private Integer connectionTimeout = 60_000; //millis

    private String engine;

    private Map<String,String> properties;

    public static ConnectionDto fromModel(Connection model) {
        return ConnectionDto.builder()
                .name(model.getName())
                .url(model.getUrl())
                .username(model.getUsername())
                .password(model.getPassword())
                .connectionTimeout(model.getConnectionTimeout())
                .engine(model.getEngine())
                .properties(model.getProperties())
                .build();
    }
}
