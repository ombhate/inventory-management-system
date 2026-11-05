package com.inventoryManagement.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.inventoryManagement.entity.User;
import com.inventoryManagement.repository.UserRepo;

@Service
public class UserService {
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public void registerUser(User user) {
		String hashedPassword = passwordEncoder.encode(user.getPassword());
		user.setPassword(hashedPassword);
		
		userRepo.save(user);
	}
	
	
	public String loginUser(User loginReq) {

		Optional<User> optUser = userRepo.findByEmail(loginReq.getEmail());
		
		if (optUser.isPresent()) {
			User dbUser = optUser.get();
		
			if (passwordEncoder.matches(loginReq.getPassword(), dbUser.getPassword())) {
				return "login successfully";
			}
		}
		
		return "invalid username and password";
	}
}