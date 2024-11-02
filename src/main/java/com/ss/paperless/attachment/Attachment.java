package com.ss.paperless.attachment;

import lombok.*;
import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "Attachment")
public class Attachment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "atta_no")
	private Long attaNo;
	@Column(name = "atta_key", nullable = false, length = 500)
	private String attaKey;
	@Column(name = "atta_url", nullable = false, length = 1000)
	private String attaUrl;
	@Column(name = "atta_original_name", nullable = false, length = 500)
	private String attaOriginalName;
	@Column(name = "atta_size", nullable = false)
	private Long attaSize;
}