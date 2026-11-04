package com.inventoryManagement.controller;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import com.inventoryManagement.repository.UserRepo;
import com.inventoryManagement.services.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.inventoryManagement.InventoryManagementApplication;
import com.inventoryManagement.entity.Product;
import com.inventoryManagement.repository.ProductRepo;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
 
    
	@PostMapping("/addProduct")
	public String addProduct(@RequestBody Product product) {
		productService.addProduct(product);
		
		return "product added successfully";
		
	}
	
	@GetMapping("/viewProducts")
	public List<Product> viewProducts() {
		return productService.viewProducts();
	}
	
	@PutMapping("/updateProduct/{id}")
	public String updateProduct(@PathVariable int id, @RequestBody Product newProduct) {
		
		return productService.updateProduct(id, newProduct);
		
	}
	
	
	@DeleteMapping("/deleteProduct/{id}")
	public String deleteProduct(@PathVariable int id) {
		productService.deleteProduct(id);
		return "Product deleted successfully";
	}
	
	@GetMapping("/searchProduct")
	public List<Product> searchProduct(@RequestParam String keyword) {
		return productService.searchProduct(keyword);
		
	}
	
	@GetMapping("/findByCategoryId/{categoryId}")
	public List<Product> findByCategoryId(@PathVariable int categoryId){
		return productService.findByCategoryId(categoryId);
		
	}
	
	@GetMapping("/lowStockProducts")
	public List<Product> lowStockProducts(@RequestParam(defaultValue = "10") int threshhold){
		return productService.lowStockProducts(threshhold);
	}
	
	
	@PatchMapping("/updateStockQuant/{id}")
	public String updateStockQuant(@PathVariable int id, @RequestParam int quantity) {
		
		 productService.updateStockQuant(id, quantity);
		 return "Stock Quan updated successfully";
		
	}
		
}
