package com.inventoryManagement.services;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.inventoryManagement.entity.Product;
import com.inventoryManagement.repository.ProductRepo;

@Service
public class ProductService {
	
	@Autowired
	private ProductRepo productRepo;
	
	
	
	
	public void addProduct(Product product) {
		productRepo.save(product);
	}
	
	public List<Product> viewProducts(){
		
		return productRepo.findAll();
	}
	
	public String updateProduct(int id, Product newProduct) {
Optional<Product> optionalProduct= productRepo.findById(id);
		
		if(optionalProduct.isPresent()) {
			Product product = optionalProduct.get();
			
			product.setName(newProduct.getName());
			product.setSku(newProduct.getSku());
			product.setPrice(newProduct.getPrice());
			product.setQuantity(newProduct.getQuantity());
			if (newProduct.getCategory() != null) {
				product.setCategory(newProduct.getCategory());
			}
			product.setUpdated_at(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
			
			productRepo.save(product);
			return "Product update dSuccessfully";
		}
		else {
			return "product not found with this id";
		}
	}
	
	public String deleteProduct(int id) {
		if(productRepo.existsById(id)) {
			productRepo.deleteById(id);
			return "product deleted succesfully";
			}
			else {
				return "product not found by ID";
			}
	}
	
	public List<Product> searchProduct(String keyword){
		return productRepo.findByNameOrSku(keyword, keyword);
	}
	
	public List<Product> findByCategoryId(int id){
		return productRepo.findByCategory_Id(id);
	}
	
	public List<Product> lowStockProducts(int threshhold) {
		return productRepo.findByQuantityLessThan(threshhold);
	}
	
	public String updateStockQuant(int id, int quant) {
		
		Optional<Product> optProduct = productRepo.findById(id);
		if(optProduct.isPresent()) {
			Product product = optProduct.get();
			
			product.setQuantity(quant);
			productRepo.save(product);
			return "Quantitiy updated successfully";
		}
		else {
			return "product not found with id: "+id; 
		}
		
	}

}
