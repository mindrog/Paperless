	package com.ss.paperless.s3;
	
	import com.amazonaws.services.s3.AmazonS3;
	import com.amazonaws.services.s3.model.PutObjectRequest;
	import com.amazonaws.services.s3.model.CannedAccessControlList;
	import com.amazonaws.services.s3.model.S3Object;
	import org.springframework.beans.factory.annotation.Value;
	import org.springframework.stereotype.Service;
	import org.springframework.web.multipart.MultipartFile;
	import java.io.IOException;
	
	@Service
	public class S3Service {
		private final AmazonS3 amazonS3;
		@Value("${aws.s3Bucket}")
		private String bucketName;
	
		public S3Service(AmazonS3 amazonS3) {
			this.amazonS3 = amazonS3;
		}
	
		public String uploadFile(MultipartFile file, String folder, Long entityId) throws IOException {
	        String fileName = folder + "/" + entityId + "/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();

	        PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, fileName, file.getInputStream(), null)
	                .withCannedAcl(CannedAccessControlList.PublicRead);

	        // S3에 객체 업로드
	        amazonS3.putObject(putObjectRequest);
	        return amazonS3.getUrl(bucketName, fileName).toString();
	    }

	 
	    public S3Object getFile(String folder, Long entityId, String fileName) {
	        String key = folder + "/" + entityId + "/" + fileName;
	        return amazonS3.getObject(bucketName, key);
	    }
	
	}