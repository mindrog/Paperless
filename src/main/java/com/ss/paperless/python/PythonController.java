package com.ss.paperless.python;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;

@RestController
public class PythonController {

    @GetMapping("/graph-data")
    public String runPythonScript() {
        try {

            String pythonScriptPath = "C:/fullstack/paperless/paperless/Paperless/src/main/frontend/src/graph_python/graph.py";
            System.out.println(new File(pythonScriptPath).getAbsolutePath());

            // Python 스크립트를 실행하는 명령어
            ProcessBuilder processBuilder = new ProcessBuilder("python", pythonScriptPath);

            processBuilder.redirectErrorStream(true);
            Process process = processBuilder.start();

            // 스크립트 실행 결과를 읽음
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }

            return output.toString();  // Python 스크립트 실행 결과를 반환

        } catch (Exception e) {
            e.printStackTrace();
            return "Python failed!!";
        }
    }
}
