package com.ss.paperless.email;

import com.ss.paperless.attachment.Attachment;
import lombok.*;
import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "EmailAttachment")
@IdClass(EmailAttachmentId.class)
public class EmailAttachment {
	@Id
	@Column(name = "email_no")
	private Long emailNo;
	@Id
	@Column(name = "atta_no")
	private Long attaNo;
	@ManyToOne
	@JoinColumn(name = "email_no", insertable = false, updatable = false)
	private Emailmessage email;
	@ManyToOne
	@JoinColumn(name = "atta_no", insertable = false, updatable = false)
	private Attachment attachment;
}