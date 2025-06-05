package com.fiiconnect.api.didactic.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@EqualsAndHashCode
@Entity
@Table(name = "global_constant")
public class GlobalConstant {
    @Id
    private String name;
    private String value;
}
