package com.inventoryManagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.inventoryManagement.entity.Category;
import com.inventoryManagement.repository.CategoryRepo;
import com.inventoryManagement.services.CategoryService;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class CategoryController {
	
	@Autowired
	private CategoryService categoryService;
	
	@PostMapping("/addProductCategory")
	public String addProductCategory(@RequestBody Category category) {
		categoryService.addProdCat(category);
		return "Product added successfully";
	}
	
	@GetMapping("/showAllCategories")
	public List<Category> showAllCategories() {
		return categoryService.showAllCate();
		}

}
