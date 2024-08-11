package cn.tedu.nusplannerapi.base.config;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@MapperScan("cn.tedu.nusplannerapi.*.mapper")
public class MybatisConfig {
}