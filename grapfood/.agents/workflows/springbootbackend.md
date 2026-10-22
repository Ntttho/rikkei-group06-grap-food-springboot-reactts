---
description: Comprehensive Spring Boot Backend development workflow covering architecture, domain modeling, DTOs, JPA entities, business logic, REST APIs, Security, testing, and deployment.
---

# Spring Boot Backend Development Workflow

You are my Senior Spring Boot Software Engineer Mentor. When developing or reviewing any backend feature or module, follow this systematic workflow:

## Step 1: Requirements & Domain Analysis
1. Analyze the functional requirements and business rules.
2. Identify actors, roles, and permissions required (e.g., CUSTOMER, ADMIN, MERCHANT, SHIPPER).
3. Identify data entities, attributes, constraints, and relationships (One-to-Many, Many-to-One, Many-to-Many).
4. Define the RESTful API endpoints, HTTP methods, URL paths, request payloads, and response structures.

## Step 2: Database Schema & Entity Design
1. Design MySQL relational tables with proper types, primary keys, foreign keys, unique constraints, and indexes.
2. Implement JPA Entities with:
   - Proper annotations (`@Entity`, `@Table(name = "...")`, `@Id`, `@GeneratedValue`)
   - Proper relationship mapping (`@ManyToOne(fetch = FetchType.LAZY)`, `@OneToMany(mappedBy = "...")`)
   - Base auditing attributes (`createdAt`, `updatedAt`)
   - Enums mapped with `@Enumerated(EnumType.STRING)`

## Step 3: DTOs & Validation
1. Create dedicated Request DTOs:
   - Add Jakarta validation annotations (`@NotBlank`, `@NotNull`, `@Size`, `@Min`, `@Email`).
2. Create dedicated Response DTOs:
   - Decouple internal database models from API responses.
   - Prevent sensitive field leakage (e.g., passwords, internal flags).
3. Standardize response wrapping with `ApiResponse<T>`.

## Step 4: Repository Layer
1. Extend `JpaRepository<Entity, ID>`.
2. Define custom query methods using Spring Data method naming conventions or `@Query` with JPQL / native SQL when needed.
3. Optimize queries with JOIN FETCH where necessary to avoid N+1 queries.

## Step 5: Service Layer (Business Logic & Transactions)
1. Implement business rules, calculations, and validations.
2. Annotate methods modifying data with `@Transactional`.
3. Handle exceptional cases by throwing domain-specific exceptions (`ResourceNotFoundException`, `BadRequestException`).
4. Apply SLF4J logging (`@Slf4j`) for critical state transitions and debug traces.

## Step 6: Controller Layer & API Exposure
1. Create `@RestController` mapped to `/api/v1/...`.
2. Inject required services using constructor injection (`@RequiredArgsConstructor`).
3. Add `@Valid` to `@RequestBody` parameters.
4. Return appropriate HTTP status codes (`200 OK`, `201 Created`, `204 No Content`).
5. Document with Springdoc OpenAPI annotations (`@Tag`, `@Operation`, `@ApiResponse`) when requested.

## Step 7: Security & Exception Handling
1. Secure endpoints using Spring Security 6 (`SecurityFilterChain`, `@PreAuthorize`).
2. Ensure password hashing with `BCryptPasswordEncoder` and JWT token extraction.
3. Verify `@RestControllerAdvice` handles all exceptions thrown by this feature.

## Step 8: Unit & Integration Testing
1. Unit tests for Service layer using **JUnit 5** and **Mockito** (testing happy path, validation failures, edge cases, exceptions).
2. Controller tests using `@WebMvcTest` and `MockMvc` verifying status codes and JSON payloads.
3. Verify test coverage meets quality thresholds (80%+).

## Step 9: Code Review & Quality Checklist
- [ ] Are SOLID principles respected?
- [ ] Is constructor injection used exclusively?
- [ ] Are sensitive data and credentials kept out of logs and responses?
- [ ] Are database transactions properly configured (`@Transactional`)?
- [ ] Are validation messages user-friendly and localized if needed?
