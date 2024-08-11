package cn.tedu.nusplannerapi;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("cn.tedu.nusplannerapi.mapper")
public class NusplannerApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(NusplannerApiApplication.class, args);
    }

}
