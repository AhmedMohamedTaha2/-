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

if (localStorage.Products) {
  Products = JSON.parse(localStorage.Products);
}

let getTotal = () => {
  let ProductPriceValue = ProductPrice.value;
  let ProductTaxValue = ProductTax.value;
  let ProductDiscountValue = ProductDiscount.value;
  let taxCost = +ProductPriceValue * (ProductTaxValue / 100);
  let price = +taxCost + +ProductPriceValue;
  ProductTotal.value = +price - +ProductDiscountValue;
};

for (let i = 1; i < inputs.length - 1; i++) {
  inputs[i].addEventListener("keyup", getTotal);
}

let clearInputs = () => {
  ProductTitle.value = "";
  ProductPrice.value = "";
  ProductTax.value = "";
  ProductDiscount.value = "";
  ProductTotal.value = "";
  ProductCount.value = "";
  ProductDepartment.value = "";
};

window.addEventListener("click", (event) => {
  if (!event.target.matches(".layer") && !event.target.matches("input")) {
    layer.style.display = "none";
  }
});

let createOrUpdateProduct = () => {
  let isCreatingNewObject = mood === "create";

  if (isCreatingNewObject && isAnyInputEmpty) {
    layer.style.display = "block";
    return;
  }

  let newProduct = {
    title: ProductTitle.value,
    price: ProductPrice.value,
    tax: ProductTax.value,
    discount: ProductDiscount.value,
    total: ProductTotal.value,
    count: ProductCount.value,
    department: ProductDepartment.value,
  };

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

  clearInputs();
  DisplayProducts();
  localStorage.setItem("Products", JSON.stringify(Products));
};

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

let deleteProduct = (index) => {
  Products.splice(index, 1);
  localStorage.Products = JSON.stringify(Products);
  DisplayProducts();
};

let updateProduct = (index) => {
  mood = "update";
  globalID = index;
  ProductTitle.value = Products[index].title;
  ProductPrice.value = Products[index].price;
  ProductTax.value = Products[index].tax;
  ProductDiscount.value = Products[index].discount;
  ProductTotal.value = Products[index].total;
  ProductCount.classList.add("none");
  ProductDepartment.value = Products[index].department;

  mainBtn.value = `Edit Product N. ${index + 1}`;
  mainBtn.classList.replace("btn", "btnupdate");
};

let mainFunction = () => {
  isAnyInputEmpty = false;

  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value.trim() === "") {
      isAnyInputEmpty = true;
      break;
    }
  }

  createOrUpdateProduct();
};

mainBtn.addEventListener("click", mainFunction);
