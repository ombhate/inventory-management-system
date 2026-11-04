package com.inventoryManagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.inventoryManagement.entity.Product;

public interface ProductRepo extends JpaRepository<Product, Integer> {
	

	List<Product> findByNameOrSku(String name, String sku);
	
	List<Product> findByCategory_Id(int categoryId);


	List<Product> findByQuantityLessThan(int threshhold);

	

}
