package com.ss.paperless.python;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PythonService {
    
    public String getGraphData() {
        String url = "http://localhost:5000/graph-data";  // Flask 서버의 경로
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}
