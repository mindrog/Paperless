package com.ss.paperless.attachment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import javax.persistence.Column;


import javax.persistence.Column;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttachmentDTO {
	private String fileName;
	private String fileUrl;

	private Long attaNo;
	private String attaKey;
	private String attaUrl;
	private String attaOriginalName;
	private Long attaSize;

	public AttachmentDTO(Long attaNo,String attaOriginalName, String attaUrl,Long attaSize) {
		this.attaOriginalName = attaOriginalName;
		this.attaUrl = attaUrl;
		this.attaSize=attaSize;
		this.attaNo = attaNo;
	}
}