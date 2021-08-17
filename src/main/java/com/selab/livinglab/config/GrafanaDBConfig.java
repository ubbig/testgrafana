package com.selab.livinglab.config;

import groovy.util.logging.Slf4j;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

@Slf4j
@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        entityManagerFactoryRef = "grafanaEntityManager",
        transactionManagerRef = "grafanaTransactionManager",
        basePackages = "selab.livinglab.test.repository.grafana"
)
public class GrafanaDBConfig {

    @Setter(onMethod_ = @Autowired)
    private Environment environment;

    @Bean
    public DataSource grafanaDataSource() {
        DriverManagerDataSource dataSource = new DriverManagerDataSource();
        dataSource.setDriverClassName(environment.getProperty("spring.datasource-grafana.driver-class-name"));
        dataSource.setUrl(environment.getProperty("spring.datasource-grafana.url"));
        dataSource.setUsername(environment.getProperty("spring.datasource-grafana.username"));
        dataSource.setPassword(environment.getProperty("spring.datasource-grafana.password"));
        return dataSource;
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean grafanaEntityManager(EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(grafanaDataSource())
                .properties(hibernateProperties())
                .packages("selab.livinglab.test.model.entity")
                .persistenceUnit("grafanaEntityManager")
                .build();
    }
    private Map hibernateProperties() {
        Resource resource = new ClassPathResource("hibernate.properties");
        Map result = new HashMap();

        try {
            Properties properties = PropertiesLoaderUtils.loadProperties(resource);

            result = properties.entrySet().stream().collect(Collectors.toMap(
                    keyElement -> keyElement.getKey().toString(),
                    valueElement -> valueElement.getValue())
            );
        } catch (IOException e) {
            
        }
        return result;
    }
}
