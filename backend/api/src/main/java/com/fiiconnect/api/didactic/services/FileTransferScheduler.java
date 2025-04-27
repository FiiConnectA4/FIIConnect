package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.configs.SftpGateway;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.io.File;
import java.io.FilenameFilter;

@Component
public class FileTransferScheduler {

    @Value("${sftp.outbound.local.dir}")
    private String srcPath;

    @Value("${sftp.outbound.remote.dir}")
    private String destPath;

    @Autowired
    private SftpGateway gateway;

    @Scheduled(cron = "${sftp.outbound.schedule}")
    public void outboundFileTransfer() {
        System.out.println("outboundFileTransfer start: " + srcPath);
        try {
            File fileDir = new File(srcPath);
            String[] fileNames = fileDir.list((dir, name) -> StringUtils.endsWithIgnoreCase(name, ".txt"));

            assert fileNames != null;
            for (String fileName: fileNames) {
                System.out.println("File: " + fileName);
                File file = new File(srcPath + "/" +fileName);
                if (file.exists() && file.isFile()) {
                    gateway.sendFile(file, destPath);
                }
            }
        } catch (Exception e) {
            //log your errors
            System.out.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}