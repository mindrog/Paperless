package com.ss.paperless.email;

import java.time.LocalDateTime;
import java.util.List;

import com.ss.paperless.attachment.AttachmentDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RestoreRequest {
	 private List<Long> emailIds;
}
