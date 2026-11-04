package com.inventoryManagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.inventoryManagement.entity.User;
import com.inventoryManagement.repository.UserRepo;
import com.inventoryManagement.services.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
	
	@Autowired
	private  UserService userService;
	
	@PostMapping("/register")
	public String registerUser(@RequestBody User user) {
		userService.registerUser(user);
		return "User registered successully";
	}
	
	@PostMapping("/login")
	public String loginUser(@RequestBody User loginRequest) {
		return userService.loginUser(loginRequest);
	
	
	}
}
