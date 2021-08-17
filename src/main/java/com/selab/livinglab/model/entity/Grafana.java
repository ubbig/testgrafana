package com.selab.livinglab.model.entity;


import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;



import javax.persistence.*;

@Entity
@Table(name = "jeollabukdo")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Grafana {
    @Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long JeollabukdoId;

	@Column(nullable = false)
	private String lon;

	@Column(nullable = false)
	private String lat;

	@Column(nullable = false)
	private Long DistrictID_DistrictID;




}
