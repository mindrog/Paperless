package com.ss.paperless.email;

import java.util.List;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeleteEmailsRequest {
    private List<Long> emailIds;
}