// Selecting elements from the HTML document
let inputs = document.querySelectorAll(".body .form input");
let ProductTitle = inputs[0];
let ProductPrice = inputs[1];
let ProductTax = inputs[2];
let ProductDiscount = inputs[3];
let ProductTotal = inputs[4];
let ProductCount = inputs[5];
let ProductDepartment = inputs[6];
let mainBtn = inputs[7];
let tbody = document.querySelector("#tbody");

let mood = "create";
let globalID;
let layer = document.querySelector(".layer");
let isAnyInputEmpty = false;
let Products = [];

// Checking if there are products stored in local storage and retrieving them
if (localStorage.Products) {
  Products = JSON.parse(localStorage.Products);
}

// Function to calculate the total price based on input values
let getTotal = () => {
  let ProductPriceValue = ProductPrice.value;
  let ProductTaxValue = ProductTax.value;
  let ProductDiscountValue = ProductDiscount.value;
  let taxCost = +ProductPriceValue * (ProductTaxValue / 100);
  let price = +taxCost + +ProductPriceValue;
  ProductTotal.value = +price - +ProductDiscountValue;
};

// Adding keyup event listeners to input elements (except the first and last) to trigger getTotal function
for (let i = 1; i < inputs.length - 1; i++) {
  inputs[i].addEventListener("keyup", getTotal);
}

// Function to clear the input values
let clearInputs = () => {
  ProductTitle.value = "";
  ProductPrice.value = "";
  ProductTax.value = "";
  ProductDiscount.value = "";
  ProductTotal.value = "";
  ProductCount.value = "";
  ProductDepartment.value = "";
};

// Handling the display of a layer element when clicking outside the layer or any input element
window.addEventListener("click", (event) => {
  if (!event.target.matches(".layer") && !event.target.matches("input")) {
    layer.style.display = "none";
  }
});

// Function to create or update a product
let createOrUpdateProduct = () => {
  let isCreatingNewObject = mood === "create";

  // Checking if creating a new product and if any input is empty
  if (isCreatingNewObject && isAnyInputEmpty) {
    layer.style.display = "block";
    return;
  }

  // Creating a new product object with input values
  let newProduct = {
    title: ProductTitle.value,
    price: ProductPrice.value,
    tax: ProductTax.value,
    discount: ProductDiscount.value,
    total: ProductTotal.value,
    count: ProductCount.value,
    department: ProductDepartment.value,
  };

  // Adding the new product to the Products array
  if (isCreatingNewObject) {
    if (+ProductCount.value > 1) {
      for (let i = 1; i <= +ProductCount.value; i++) {
        Products.push(newProduct);
      }
    } else {
      Products.push(newProduct);
    }
  } else {
    Products[globalID] = newProduct;
    mood = "create";
    mainBtn.value = "Add";
    mainBtn.classList.replace("btnupdate", "btn");
    ProductCount.classList.remove("none");
  }

  // Clearing the inputs, updating the displayed products table, and saving the products in local storage
  clearInputs();
  DisplayProducts();
  localStorage.setItem("Products", JSON.stringify(Products));
};

// Function to generate an HTML table based on the products in the Products array
let DisplayProducts = () => {
  let table = "";
  for (let i = 0; i < Products.length; i++) {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${Products[i].title}</td>
        <td>${Products[i].price}</td>
        <td>${Products[i].tax}</td>
        <td>${Products[i].discount}</td>
        <td>${Products[i].total}</td>
        <td>${Products[i].count}</td>
        <td>${Products[i].department}</td>
        <td class="action">
          <input type="button" value="Edit" class="edit" onclick="updateProduct(${i})" />
          <input type="button" value="Delete" class="delete" onclick="deleteProduct(${i})"/>
        </td>
      </tr>
    `;
  }
    tbody.innerHTML = table;
};

// Function to delete a product from the Products array
let deleteProduct = (index) => {
  Products.splice(index, 1);
  localStorage.Products = JSON.stringify(Products);
  DisplayProducts();
};

// Function to update a product in the Products array
let updateProduct = (index) => {
  mood = "update";
  globalID = index;
  ProductTitle.value = Products[index].title;
  ProductPrice.value = Products[index].price;
  ProductTax.value = Products[index].tax;
  ProductDiscount.value = Products[index].discount;
  ProductTotal.value = Products[index].total;
  ProductCount.value = Products[index].count;
  ProductDepartment.value = Products[index].department;
  mainBtn.value = "Update";
  mainBtn.classList.replace("btn", "btnupdate");
  ProductCount.classList.add("none");
};

// Setting up event listeners for delete and edit buttons in each row of the table
let rows = document.querySelectorAll("tbody tr");
for (let i = 0; i < rows.length; i++) {
  let deleteBtn = rows[i].querySelector(".delete");
  let editBtn = rows[i].querySelector(".edit");
  deleteBtn.addEventListener("click", () => deleteProduct(i));
  editBtn.addEventListener("click", () => updateProduct(i));
}

// Function called when the main button is clicked
let mainFunction = () => {
  isAnyInputEmpty = false;

  // Checking if any input is empty
  for (let i = 0; i < inputs.length - 1; i++) {
    if (inputs[i].value === "") {
      isAnyInputEmpty = true;
      break;
    }
  }

  // Calling the createOrUpdateProduct function
  createOrUpdateProduct();
};

// Adding a click event listener to the main button
mainBtn.addEventListener("click", mainFunction);
