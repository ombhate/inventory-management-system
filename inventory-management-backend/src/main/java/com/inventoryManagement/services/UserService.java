package com.inventoryManagement.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventoryManagement.entity.User;
import com.inventoryManagement.repository.ProductRepo;
import com.inventoryManagement.repository.UserRepo;

@Service
public class UserService {
	
	@Autowired
	private UserRepo userRepo;

	
	public void registerUser(User user) {
		userRepo.save(user);
	}
	
	public String loginUser(User loginReq) {
		
		Optional<User> optUser = userRepo.findByEmailAndPassword(loginReq.getEmail(), loginReq.getPassword());
		if(optUser.isPresent()) {
			return "login successfully";
		}
		else {
			return "invalid username and password";
		}
	}

}
