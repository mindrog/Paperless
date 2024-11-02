package com.ss.paperless.email;

import lombok.*;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailAttachmentId implements Serializable {
	private Long emailNo;
	private Long attaNo;
}