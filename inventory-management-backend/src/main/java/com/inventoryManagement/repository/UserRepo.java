package com.inventoryManagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.inventoryManagement.entity.User;

public interface UserRepo extends JpaRepository<User, Integer> {

	Optional<User> findByEmailAndPassword(String email, String password);

}
