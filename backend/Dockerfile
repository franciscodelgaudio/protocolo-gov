FROM maven:3.9.11-eclipse-temurin-26

WORKDIR /app

COPY pom.xml .
RUN mvn -q -DskipTests dependency:go-offline

COPY . .

EXPOSE 8081

CMD ["mvn", "spring-boot:run"]
