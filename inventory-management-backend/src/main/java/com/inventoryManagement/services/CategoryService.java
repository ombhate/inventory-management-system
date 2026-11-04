package com.inventoryManagement.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventoryManagement.entity.Category;
import com.inventoryManagement.repository.CategoryRepo;

@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepo categoryRepo;
	
	public void addProdCat(Category category) {
		
		categoryRepo.save(category);
	}
	
	
	public List<Category> showAllCate(){
		return categoryRepo.findAll();
	}
}