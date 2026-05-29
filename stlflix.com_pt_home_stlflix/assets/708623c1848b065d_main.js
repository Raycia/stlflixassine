document.addEventListener('DOMContentLoaded', () => {
  const buyButton1 = document.querySelector('.single-product .cart button[name="add-to-cart"]');
  const buyButton2 = document.querySelector('.single-product .cart button[type=submit]');
  const mobileTrigger = document.querySelector('.mobile-buy-trigger');

  if (mobileTrigger) {
    mobileTrigger.addEventListener('click', () => {
      if (buyButton1) {
        buyButton1.click();
      } else {
        buyButton2.click();
      }
    })
  }
})

class ModalManager {
  constructor() {
    this.userCepStorage = localStorage.getItem('cep');
    this.cepModal = document.querySelector('.modal[data-modal="cep-modal"]');
    this.editCepButtons = document.querySelectorAll('.edit-cep');
    this.closeModalButtons = document.querySelectorAll('.close-modal');
    this.updateCepForm = document.querySelector('#update-cep');

    if (this.userCepStorage) {
      this.updateHeaderUserCep(this.userCepStorage);
    }

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.closeModal();
      }
    });

    document.addEventListener('click', event => {
      if (event.target.classList.contains('modal')) {
        this.closeModal();
      }
    });

    document.addEventListener('DOMContentLoaded', () => {
      this.editCepButtons.forEach(button => {
        button?.addEventListener('click', () => {
          this.openModal(this.cepModal)
        });
      });

      this.closeModalButtons.forEach(button => {
        button?.addEventListener('click', () => {
          this.closeModal();
        });
      });

      this.updateCepForm?.addEventListener('submit', event => {
        event.preventDefault();
        const userCep = this.updateCepForm.querySelector('input[name="cep"]');
        this.updateHeaderUserCep(userCep.value);
        this.closeModal();
      });
    });
  }

  updateHeaderUserCep(cep) {
    const headerUserCepValue = document.querySelectorAll('.user-cep');
    const cepBlock = document.querySelectorAll('.cep-block');

    localStorage.setItem('cep', cep);
    headerUserCepValue.forEach(item => {
      item.innerText = cep;
    });
    cepBlock.forEach(item => {
      item.classList.add('active');
    });
  }

  closeModal() {
    const activeModal = document.querySelector('.modal[data-hidden="false"]');
    if (activeModal) {
      activeModal.dataset.hidden = true;
    }
  }

  openModal(modalElement) {
    modalElement.dataset.hidden = false;
  }
}

const modalManager = new ModalManager();


jQuery(function ($) {
  $('div.woocommerce').on('change', '.qty', function () {
    $('[name="update_cart"]').trigger('click');
  });

  setInterval(() => {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progressBar.dataset.percentage}%`;
    }
  }, 500)
});

window.handleModalImage = function (event) {
  const modalImage = document.querySelector('.variation-image-modal');
  const modalImageElement = document.querySelector('.variation-image-modal img');
  modalImageElement.src = event.target.dataset.imagesrc;

  modalManager.openModal(modalImage);
}

document.addEventListener('DOMContentLoaded', function () {
  // Função para atualizar a visibilidade dos blocos de produtos com base na seleção do radio button
  function updateProductVisibility() {
    // Obtém o valor do input radio selecionado
    var selectedCategory = document.querySelector('input[name="filament_category"]:checked');
    if (selectedCategory) {
      var selectedValue = selectedCategory.value;

      // Oculta todos os blocos de produtos
      document.querySelectorAll('.custom-filament-products').forEach(function (el) {
        el.style.display = 'none';
      });

      // Mostra o bloco de produtos correspondente à categoria selecionada
      if (document.querySelector('.custom-filament-products[data-category="' + selectedValue + '"]')) {
        document.querySelector('.custom-filament-products[data-category="' + selectedValue + '"]').style.display = 'flex';
      }
    } else {
      // Se nenhum input estiver selecionado, oculta todos os blocos
      document.querySelectorAll('.custom-filament-products').forEach(function (el) {
        el.style.display = 'none';
      });
    }
  }

  // Atualiza a visibilidade ao carregar a página
  updateProductVisibility();

  // Atualiza a visibilidade quando um radio button é selecionado
  document.querySelectorAll('input[name="filament_category"]').forEach(function (el) {
    el.addEventListener('change', updateProductVisibility);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var globalTotalQuantity = 0;

  function updateFilamentSummary() {
    if (!document.querySelector('#filament-summary .total-amount')) return

    var totalAmount = 0;
    var totalQuantity = 0;
    var productSummary = '';
    let currentDiscount = 0;
    let totalDiscount = 0;

    const unitsDiscountActive = document.querySelector('.units-discount-item.active');

    // Inclui o produto principal (da página atual) no cálculo
    var mainProductQuantity = parseInt(document.querySelector('input[name="quantity"]')?.value || 1, 10);

    // Obtém o último preço do produto principal
    var mainProductPriceElement = document.querySelector('.formatted-pix-price');
    console.log("TCL: updateFilamentSummary -> mainProductPriceElement", mainProductPriceElement)
    var mainProductPriceElements = document.querySelectorAll('.entry-summary > .price .amount');
    var mainProductPrice = 0;
    if (mainProductPriceElement) {
      var lastPriceElement = mainProductPriceElements[mainProductPriceElements.length - 1];
      mainProductPrice = parseFloat(mainProductPriceElement.dataset.originalPrice);
    }

    if (mainProductQuantity > 0) {
      totalQuantity += mainProductQuantity;
      totalAmount += mainProductQuantity * mainProductPrice;
      productSummary += '<li>' + mainProductQuantity + 'x ' + document.querySelector('h1.product_title')?.textContent + '</li>';
    }

    // Itera sobre os produtos de filamentos
    var filamentProducts = document.querySelectorAll('.custom-filament-products .filament-product');
    filamentProducts.forEach(function (product) {
      var quantityInput = product.querySelector('input[name^="quantity"]');
      var quantity = parseInt(quantityInput ? quantityInput.value : 0, 10);

      var productPriceElement = product.querySelector('.price .price-sale');
      var productPrice = parseFloat(product.querySelector('.price .price').dataset.originalPrice);

      if (quantity > 0) {
        totalQuantity += quantity;
        totalAmount += quantity * productPrice;
        productSummary += '<li>' + quantity + 'x ' + product.querySelector('h2.woocommerce-loop-product__title').textContent + '</li>';
      }
    });

    globalTotalQuantity = totalQuantity;
    
    const isLifetime = document.querySelector('#is-lifetime') && document.querySelector('#is-lifetime').value === '1';
    const isSubscriber = document.querySelector('#is-subscriber') && document.querySelector('#is-subscriber').value;
    
    if (!isLifetime && unitsDiscountActive) {
    unitsDiscountActive.classList.remove('active');

    switch (totalQuantity) {
      case 1:
        document.querySelector('.units-discount-item[data-quantity="1"]').classList.add('active')
        currentDiscount = 0;
        break;
      case 2:
        document.querySelector('.units-discount-item[data-quantity="2"]').classList.add('active')
        currentDiscount = 1;
        break;
      case 3:
        document.querySelector('.units-discount-item[data-quantity="3"]').classList.add('active')
        currentDiscount = 1.5;
        break;
      default:
        document.querySelector('.units-discount-item[data-quantity="4"]').classList.add('active')
        currentDiscount = 2;
        break;
      }
    }
    
    console.log("TCL: updateFilamentSummary -> currentDiscount", currentDiscount)
    console.log("TCL: updateFilamentSummary -> isLifetime", isLifetime)

    if (isLifetime) {
      // Usuário lifetime - preço já vem calculado com 50% do PHP, não aplica desconto adicional
      // totalAmount já contém os preços corretos (sem aplicar * 0.5)
      const currentMainProductPrice = mainProductPrice; // Usa o preço que já vem com desconto do PHP
      
      filamentProducts.forEach(function (product) {
        var productPriceElement = product.querySelector('.price .price span');
        var productPrice = parseFloat(product.querySelector('.price .price').dataset.originalPrice);
        const currentProductPrice = productPrice; // Usa o preço que já vem com desconto do PHP

        productPriceElement.innerText = '$ ' + currentProductPrice.toFixed(2).replace('.', ',');
      });
      
      if (document.querySelector('.entry-summary > .price .amount')) {
        const lastPriceElement = document.querySelectorAll('.entry-summary > .price .amount');
        lastPriceElement[lastPriceElement.length - 1].innerText = '$ ' + currentMainProductPrice.toFixed(2).replace('.', ',');
      }
    } else if (isSubscriber) {
      // Usuário assinante normal recebe desconto baseado em quantidade
      totalDiscount = totalQuantity * currentDiscount;
      totalAmount = totalAmount - totalDiscount;
      
      const currentMainProductPrice = mainProductPrice - currentDiscount;

      filamentProducts.forEach(function (product) {
        var productPriceElement = product.querySelector('.price .price span');
        var productPrice = parseFloat(product.querySelector('.price .price').dataset.originalPrice);
        const currentProductPrice = productPrice - currentDiscount;

        productPriceElement.innerText = '$ ' + currentProductPrice.toFixed(2).replace('.', ',');
      });
      
      if (document.querySelector('.entry-summary > .price .amount')) {
        const lastPriceElement = document.querySelectorAll('.entry-summary > .price .amount');
        lastPriceElement[lastPriceElement.length - 1].innerText = '$ ' + currentMainProductPrice.toFixed(2).replace('.', ',');
      }
    } else {
      // Usuário não assinante não recebe desconto
      currentDiscount = currentDiscount + 2;

      const currentMainProductPrice = mainProductPrice - currentDiscount;

    filamentProducts.forEach(function (product) {
      var productPriceElement = product.querySelector('.price .price span');
      var productPrice = parseFloat(product.querySelector('.price .price').dataset.originalPrice);
        const currentProductPrice = productPrice;

      productPriceElement.innerText = '$ ' + currentProductPrice.toFixed(2).replace('.', ',');
    });
      
      if (document.querySelector('.entry-summary > .price .amount')) {
        const lastPriceElement = document.querySelectorAll('.entry-summary > .price .amount');
        lastPriceElement[lastPriceElement.length - 1].innerText = '$ ' + currentMainProductPrice.toFixed(2).replace('.', ',');
      }
    }

    // Atualiza o bloco de resumo
    console.log("TCL: updateFilamentSummary -> mainProductPrice", mainProductPrice)
    document.querySelector('#filament-summary .total-amount').textContent = '$ ' + totalAmount.toFixed(2).replace('.', ',');
    document.querySelector('#filament-summary .total-quantity').textContent = `${totalQuantity} ite${totalQuantity > 1 ? 'ms' : 'm'}`;
    document.querySelector('#filament-summary .product-list').innerHTML = productSummary;
  }

  if (document.querySelector('#filament-summary')) {
    // Define quantidade padrão: 1 para lifetime, 4 para outros usuários
    const isLifetime = document.querySelector('#is-lifetime') && document.querySelector('#is-lifetime').value === '1';
    document.querySelector('.quantity input').value = isLifetime ? 1 : 4;
  }

  // Inicializa o resumo quando a página carrega
  updateFilamentSummary();

  // Atualiza o resumo sempre que a quantidade é alterada
  document.querySelectorAll('.custom-filament-products input[name^="quantity"], input[name="quantity"]').forEach(function (input) {
    input.addEventListener('input', updateFilamentSummary);
  });

  function addAllProductsToCart(e) {
    const minQuantity = document.querySelector('input[name="min_quantity"]').value;
    const isBundle = parseInt(minQuantity) > 1; // Verifica se é um bundle

    if (parseInt(minQuantity) > parseInt(globalTotalQuantity)) {
      alert(`A quantidade mínima é de ${minQuantity}`);
      return;
    }

    var url = '?add-to-cart-multiple=';

    // Adiciona o produto principal (da página atual)
    var mainProductID = document.querySelector('button[name="add-to-cart"]').value;
    var mainProductQuantity = document.querySelector('input[name="quantity"]').value || 1;

    // Adiciona a flag "bundle" se necessário
    url += mainProductID + ':' + mainProductQuantity;

    // Itera sobre os produtos de filamentos e adiciona os que têm quantidade maior que zero
    var filamentProducts = document.querySelectorAll('.custom-filament-products .filament-product');
    filamentProducts.forEach(function (product) {
      var productID = product.querySelector('input[name^="quantity"]').getAttribute('data-product-id');
      var quantity = product.querySelector('input[name^="quantity"]').value;

      if (quantity > 0) {
        url += ',' + productID + ':' + quantity;
      }
    });

    if (isBundle) {
      url += '&bundle=true';
    }

    // Redireciona o usuário para a URL final
    window.location.href = url;
  }

  document.querySelectorAll('.add-all-to-cart-js').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      addAllProductsToCart(e)
    });
  })

  const handleProductList = document.querySelector('.handle-product-list');

  handleProductList?.addEventListener('click', () => {
    const productList = document.querySelector('#filament-summary .product-list');

    if (productList.style.display === 'none') {
      handleProductList.textContent = 'Less';
      productList.style.display = 'block';
    } else {
      handleProductList.textContent = 'More';
      productList.style.display = 'none';
    }
  })
});

document.addEventListener('DOMContentLoaded', function () {
  function reloadCartImages() {
    // Encontre e recarregue as imagens do carrinho
    document.querySelectorAll('.cart_item img').forEach(function (img) {
      const src = img.getAttribute('data-src');
      if (src) {
        img.src = src;
      }
    });
  }

  // Recarregar imagens quando o carrinho é atualizado via AJAX
  jQuery(document.body).on('updated_cart_totals', function () {
    reloadCartImages();
  });

  // Recarregar imagens após a primeira carga
  reloadCartImages();
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.quantity-decrement').forEach(function (button) {
    button.addEventListener('click', function () {
      var input = this.nextElementSibling;
      var currentValue = parseInt(input.value, 10);
      if (currentValue > parseInt(input.min, 10)) {
        input.value = currentValue - 1;
        input.dispatchEvent(new Event('input')); // Para atualizar o resumo
      }
    });
  });

  document.querySelectorAll('.quantity-increment').forEach(function (button) {
    button.addEventListener('click', function () {
      var input = this.previousElementSibling;

      var currentValue = parseInt(input.value, 10);

      if (input.max && currentValue < parseInt(input.max, 10) || !input.max) {
        input.value = currentValue + 1;
        input.dispatchEvent(new Event('input')); // Para atualizar o resumo
      } else {
        console.log('none')
      }
    });
  });
});

// Verifica se o usuário já aceitou os cookies
const cookieBanner = document.getElementById("cookieBanner");
const acceptCookies = document.getElementById("acceptCookies");

if (!localStorage.getItem("cookiesAccepted") && cookieBanner) {
  cookieBanner.style.display = "flex";
}

// Esconde o banner ao clicar no botão
acceptCookies?.addEventListener("click", () => {
  localStorage.setItem("cookiesAccepted", "true");
  cookieBanner.style.display = "none";
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.thumbnail-block.product-thumbnail-hover').forEach(function (thumbnail) {
    const video = thumbnail.querySelector('.hover-video');
    const videoUrl = thumbnail.dataset.videoUrl;

    if (video && videoUrl) {
      thumbnail.addEventListener('mouseenter', function () {
        if (!video.querySelector('source').src || video.querySelector('source').src !== videoUrl) {
          video.querySelector('source').src = videoUrl;
          video.load(); // Carrega o vídeo quando a URL é definida
        } else if (video.querySelector('source').src && video.querySelector('source').src === videoUrl) {
          video.play(); // Carrega o vídeo quando a URL é definida
        }
      });

      thumbnail.addEventListener('mouseleave', function () {
        video.pause(); // Pausa o vídeo quando o mouse sai
      });
    }
  });
});


