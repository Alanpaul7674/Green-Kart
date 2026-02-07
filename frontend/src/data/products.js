/**
 * Product Data Store
 * Centralized product data with unique images
 */

// Product data - 135 clothing items with varied images
export const allProducts = [
  // ============ SHIRTS (15 items) ============
  { id: 1, name: 'Classic White Shirt', price: 1499, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400', category: 'Shirts', description: 'Crisp white cotton shirt perfect for any occasion. Made from 100% organic cotton with a comfortable regular fit.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 2, name: 'Blue Oxford Shirt', price: 1699, image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400', category: 'Shirts', description: 'Classic blue oxford button-down shirt. Premium cotton fabric with a timeless design.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 3, name: 'Slim Fit Black Shirt', price: 1599, image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400', category: 'Shirts', description: 'Modern slim fit black formal shirt. Perfect for office and evening occasions.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 4, name: 'Linen Casual Shirt', price: 1899, image: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=400', category: 'Shirts', description: 'Breathable linen shirt for summer days. Relaxed fit with a natural texture.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 5, name: 'Checkered Flannel Shirt', price: 1799, image: 'https://images.unsplash.com/photo-1608234808654-2a8875faa7fd?w=400', category: 'Shirts', description: 'Warm flannel shirt with classic check pattern. Soft brushed cotton for extra comfort.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 6, name: 'Denim Shirt', price: 2099, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', category: 'Shirts', description: 'Vintage wash denim shirt with snap buttons. A wardrobe essential.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 7, name: 'Pink Formal Shirt', price: 1549, image: 'https://images.unsplash.com/photo-1598961942613-ba897716405b?w=400', category: 'Shirts', description: 'Light pink formal shirt for office wear. Wrinkle-resistant fabric.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 8, name: 'Striped Business Shirt', price: 1749, image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400', category: 'Shirts', description: 'Professional striped shirt for business meetings. Premium cotton blend.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 9, name: 'Mandarin Collar Shirt', price: 1999, image: 'https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400', category: 'Shirts', description: 'Elegant mandarin collar cotton shirt. Contemporary Asian-inspired design.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 10, name: 'Hawaiian Print Shirt', price: 1299, image: 'https://images.unsplash.com/photo-1560258018-c7db7645254e?w=400', category: 'Shirts', description: 'Fun tropical print shirt for vacations. Lightweight and breezy.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 11, name: 'Olive Green Shirt', price: 1449, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', category: 'Shirts', description: 'Casual olive green cotton shirt. Versatile color for any outfit.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 12, name: 'Navy Blue Shirt', price: 1599, image: 'https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?w=400', category: 'Shirts', description: 'Classic navy blue shirt for all occasions. Durable and comfortable.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 13, name: 'Corduroy Shirt', price: 2199, image: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=400', category: 'Shirts', description: 'Soft corduroy shirt in autumn brown. Perfect for cooler weather.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 14, name: 'White Linen Shirt', price: 1899, image: 'https://images.unsplash.com/photo-1604695573706-53170668f6a6?w=400', category: 'Shirts', description: 'Pure white linen shirt for beach days. Light and airy fabric.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 15, name: 'Chambray Work Shirt', price: 1699, image: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=400', category: 'Shirts', description: 'Durable chambray work shirt. Built to last with reinforced stitching.', sizes: ['S', 'M', 'L', 'XL'] },

  // ============ T-SHIRTS (20 items) ============
  { id: 16, name: 'Basic White Tee', price: 599, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', category: 'T-Shirts', description: 'Essential white cotton t-shirt. Soft, breathable, and perfect for layering.', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 17, name: 'Black Crew Neck Tee', price: 649, image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400', category: 'T-Shirts', description: 'Classic black crew neck t-shirt. A wardrobe staple for everyone.', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 18, name: 'Striped Breton Tee', price: 799, image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400', category: 'T-Shirts', description: 'Red and white striped nautical tee. French-inspired classic design.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 19, name: 'Graphic Print Tee', price: 899, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', category: 'T-Shirts', description: 'Cool graphic print casual t-shirt. Express your unique style.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 20, name: 'V-Neck Grey Tee', price: 699, image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400', category: 'T-Shirts', description: 'Comfortable grey V-neck t-shirt. Flattering fit for all body types.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 21, name: 'Polo T-Shirt Navy', price: 1199, image: 'https://images.unsplash.com/photo-1625910513413-5fc45e76fd3d?w=400', category: 'T-Shirts', description: 'Classic navy polo t-shirt. Smart casual essential.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 22, name: 'Oversized Tee', price: 849, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400', category: 'T-Shirts', description: 'Trendy oversized fit t-shirt. Relaxed and comfortable.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 23, name: 'Henley T-Shirt', price: 999, image: 'https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?w=400', category: 'T-Shirts', description: 'Casual henley neck t-shirt. Button placket adds style.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 24, name: 'Tie-Dye Tee', price: 749, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', category: 'T-Shirts', description: 'Colorful tie-dye pattern t-shirt. Unique hand-dyed design.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 25, name: 'Long Sleeve Tee', price: 899, image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400', category: 'T-Shirts', description: 'Full sleeve cotton t-shirt. Great for layering or cooler days.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 26, name: 'Pocket Tee', price: 699, image: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=400', category: 'T-Shirts', description: 'Simple tee with chest pocket. Casual everyday style.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 27, name: 'Raglan Sleeve Tee', price: 799, image: 'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=400', category: 'T-Shirts', description: 'Baseball style raglan t-shirt. Sporty and comfortable.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 28, name: 'Muscle Fit Tee', price: 849, image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400', category: 'T-Shirts', description: 'Athletic muscle fit t-shirt. Shows off your gains.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 29, name: 'Vintage Wash Tee', price: 999, image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400', category: 'T-Shirts', description: 'Soft vintage washed t-shirt. Pre-washed for extra softness.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 30, name: 'Organic Cotton Tee', price: 1099, image: 'https://images.unsplash.com/photo-1581790411628-7a14eb8a6df4?w=400', category: 'T-Shirts', description: 'Eco-friendly organic cotton t-shirt. Sustainable fashion choice.', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  { id: 31, name: 'Slogan Tee', price: 799, image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=400', category: 'T-Shirts', description: 'Motivational slogan print tee. Spread positive vibes.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 32, name: 'Color Block Tee', price: 899, image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=400', category: 'T-Shirts', description: 'Modern color block design t-shirt. Bold and contemporary.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 33, name: 'Dropped Shoulder Tee', price: 949, image: 'https://images.unsplash.com/photo-1485218126466-34e6392ec754?w=400', category: 'T-Shirts', description: 'Relaxed dropped shoulder t-shirt. Easy and effortless style.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 34, name: 'Embroidered Tee', price: 1149, image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=400', category: 'T-Shirts', description: 'Premium embroidered logo t-shirt. Detailed craftsmanship.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 35, name: 'Acid Wash Tee', price: 999, image: 'https://images.unsplash.com/photo-1606115915090-be18fea23ec7?w=400', category: 'T-Shirts', description: 'Trendy acid wash effect t-shirt. Retro 90s vibe.', sizes: ['S', 'M', 'L', 'XL'] },

  // ============ JEANS (15 items) ============
  { id: 36, name: 'Slim Fit Blue Jeans', price: 2499, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', category: 'Jeans', description: 'Classic slim fit blue denim jeans. Comfortable stretch fabric.', sizes: ['28', '30', '32', '34', '36', '38'] },
  { id: 37, name: 'Straight Leg Black Jeans', price: 2699, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400', category: 'Jeans', description: 'Timeless straight leg black jeans. Versatile wardrobe essential.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 38, name: 'Skinny Fit Jeans', price: 2299, image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=400', category: 'Jeans', description: 'Modern skinny fit stretch jeans. Figure-hugging silhouette.', sizes: ['26', '28', '30', '32', '34'] },
  { id: 39, name: 'Relaxed Fit Jeans', price: 2599, image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=400', category: 'Jeans', description: 'Comfortable relaxed fit jeans. Easy and casual style.', sizes: ['30', '32', '34', '36', '38', '40'] },
  { id: 40, name: 'Ripped Distressed Jeans', price: 2799, image: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400', category: 'Jeans', description: 'Trendy ripped and distressed jeans. Edgy street style look.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 41, name: 'High Waist Mom Jeans', price: 2899, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', category: 'Jeans', description: 'Vintage style high waist mom jeans. Flattering retro silhouette.', sizes: ['24', '26', '28', '30', '32'] },
  { id: 42, name: 'Bootcut Jeans', price: 2499, image: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=400', category: 'Jeans', description: 'Classic bootcut denim jeans. Timeless and flattering.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 43, name: 'Tapered Fit Jeans', price: 2699, image: 'https://images.unsplash.com/photo-1555689502-c4b22d76c56f?w=400', category: 'Jeans', description: 'Modern tapered fit jeans. Sleek ankle-grazing style.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 44, name: 'Light Wash Jeans', price: 2399, image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400', category: 'Jeans', description: 'Fresh light wash summer jeans. Perfect for warm weather.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 45, name: 'Dark Indigo Jeans', price: 2599, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', category: 'Jeans', description: 'Rich dark indigo raw denim jeans. Premium quality fabric.', sizes: ['28', '30', '32', '34', '36', '38'] },
  { id: 46, name: 'Wide Leg Jeans', price: 2799, image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=400', category: 'Jeans', description: 'Fashionable wide leg denim jeans. Bold 70s inspired style.', sizes: ['26', '28', '30', '32', '34'] },
  { id: 47, name: 'Cargo Jeans', price: 2999, image: 'https://images.unsplash.com/photo-1519455953755-af066f52f1a6?w=400', category: 'Jeans', description: 'Utility cargo pocket jeans. Functional and stylish.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 48, name: 'Cropped Ankle Jeans', price: 2199, image: 'https://images.unsplash.com/photo-1560243563-062bfc001d68?w=400', category: 'Jeans', description: 'Stylish cropped ankle length jeans. Show off your footwear.', sizes: ['26', '28', '30', '32', '34'] },
  { id: 49, name: 'Stretch Denim Jeans', price: 2499, image: 'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=400', category: 'Jeans', description: 'Super stretch comfort jeans. Move freely all day.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 50, name: 'Selvedge Denim Jeans', price: 4999, image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=400', category: 'Jeans', description: 'Premium Japanese selvedge denim. Investment quality.', sizes: ['28', '30', '32', '34', '36'] },

  // ============ DRESSES (15 items) ============
  { id: 51, name: 'Floral Maxi Dress', price: 2999, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', category: 'Dresses', description: 'Beautiful floral print maxi dress. Flowing and feminine.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 52, name: 'Little Black Dress', price: 3499, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', category: 'Dresses', description: 'Classic little black cocktail dress. Elegant and timeless.', sizes: ['XS', 'S', 'M', 'L'] },
  { id: 53, name: 'Linen Summer Dress', price: 2499, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=400', category: 'Dresses', description: 'Breathable linen dress for summer. Cool and comfortable.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 54, name: 'Wrap Midi Dress', price: 2799, image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400', category: 'Dresses', description: 'Elegant wrap style midi dress. Flattering for all figures.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 55, name: 'Bodycon Dress', price: 2199, image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?w=400', category: 'Dresses', description: 'Fitted bodycon party dress. Show off your curves.', sizes: ['XS', 'S', 'M', 'L'] },
  { id: 56, name: 'Shirt Dress', price: 2599, image: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400', category: 'Dresses', description: 'Casual button-front shirt dress. Effortlessly chic.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 57, name: 'A-Line Dress', price: 2699, image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', category: 'Dresses', description: 'Classic A-line silhouette dress. Universally flattering.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 58, name: 'Slip Dress', price: 1999, image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400', category: 'Dresses', description: 'Silky slip dress in blush pink. Delicate and romantic.', sizes: ['XS', 'S', 'M', 'L'] },
  { id: 59, name: 'Denim Dress', price: 2899, image: 'https://images.unsplash.com/photo-1562137369-1a1a0bc66744?w=400', category: 'Dresses', description: 'Casual denim button-up dress. Versatile everyday style.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 60, name: 'Pleated Midi Dress', price: 3199, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', category: 'Dresses', description: 'Elegant pleated midi dress. Movement and grace.', sizes: ['XS', 'S', 'M', 'L'] },
  { id: 61, name: 'Off-Shoulder Dress', price: 2699, image: 'https://images.unsplash.com/photo-1568252542512-9fe8fe9c87bb?w=400', category: 'Dresses', description: 'Romantic off-shoulder summer dress. Flirty and fun.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 62, name: 'Sweater Dress', price: 2999, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', category: 'Dresses', description: 'Cozy knit sweater dress for winter. Warm and stylish.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 63, name: 'Blazer Dress', price: 3999, image: 'https://images.unsplash.com/photo-1551803091-e20673f15770?w=400', category: 'Dresses', description: 'Power blazer dress for office. Confident and professional.', sizes: ['XS', 'S', 'M', 'L'] },
  { id: 64, name: 'Tiered Ruffle Dress', price: 2799, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', category: 'Dresses', description: 'Playful tiered ruffle dress. Feminine and flirty.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 65, name: 'Halter Neck Dress', price: 2499, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400', category: 'Dresses', description: 'Stylish halter neck evening dress. Elegant neckline.', sizes: ['XS', 'S', 'M', 'L'] },

  // ============ JACKETS (12 items) ============
  { id: 66, name: 'Denim Jacket', price: 3499, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', category: 'Jackets', description: 'Classic blue denim jacket. Timeless layering piece.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 67, name: 'Leather Biker Jacket', price: 7999, image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=400', category: 'Jackets', description: 'Genuine leather biker jacket. Rebel with style.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 68, name: 'Bomber Jacket', price: 3999, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', category: 'Jackets', description: 'Classic bomber jacket in olive. Military-inspired style.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 69, name: 'Blazer Navy', price: 4999, image: 'https://images.unsplash.com/photo-1593030103066-0093718e0ae7?w=400', category: 'Jackets', description: 'Formal navy blue blazer. Tailored sophistication.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 70, name: 'Windbreaker', price: 2999, image: 'https://images.unsplash.com/photo-1544923246-77307dd628b0?w=400', category: 'Jackets', description: 'Lightweight windbreaker jacket. Weather protection.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 71, name: 'Puffer Jacket', price: 4499, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400', category: 'Jackets', description: 'Warm quilted puffer jacket. Winter essential.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 72, name: 'Track Jacket', price: 2499, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', category: 'Jackets', description: 'Sporty track jacket with stripes. Athletic style.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 73, name: 'Corduroy Jacket', price: 3799, image: 'https://images.unsplash.com/photo-1548126032-079a0fb0099d?w=400', category: 'Jackets', description: 'Retro corduroy trucker jacket. Vintage vibes.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 74, name: 'Varsity Jacket', price: 3999, image: 'https://images.unsplash.com/photo-1626307416562-ee839676f5fc?w=400', category: 'Jackets', description: 'College style varsity jacket. Campus classic.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 75, name: 'Quilted Jacket', price: 3499, image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=400', category: 'Jackets', description: 'Lightweight quilted jacket. Transitional weather.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 76, name: 'Fleece Jacket', price: 2799, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', category: 'Jackets', description: 'Cozy fleece zip-up jacket. Soft and warm.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 77, name: 'Trench Coat', price: 5999, image: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400', category: 'Jackets', description: 'Classic beige trench coat. Timeless elegance.', sizes: ['S', 'M', 'L', 'XL'] },

  // ============ HOODIES (10 items) ============
  { id: 78, name: 'Classic Grey Hoodie', price: 1999, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', category: 'Hoodies', description: 'Essential grey pullover hoodie. Cozy everyday comfort.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 79, name: 'Black Zip-Up Hoodie', price: 2299, image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400', category: 'Hoodies', description: 'Versatile black zip-up hoodie. Easy on and off.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 80, name: 'Oversized Hoodie', price: 2499, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400', category: 'Hoodies', description: 'Trendy oversized fit hoodie. Streetwear essential.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 81, name: 'Organic Cotton Hoodie', price: 2799, image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?w=400', category: 'Hoodies', description: 'Eco-friendly organic hoodie. Sustainable comfort.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 82, name: 'Cropped Hoodie', price: 1799, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400', category: 'Hoodies', description: 'Stylish cropped hoodie. Trendy silhouette.', sizes: ['XS', 'S', 'M', 'L'] },
  { id: 83, name: 'Tie-Dye Hoodie', price: 2199, image: 'https://images.unsplash.com/photo-1618354691438-25bc04584c23?w=400', category: 'Hoodies', description: 'Colorful tie-dye print hoodie. Stand out style.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 84, name: 'Fleece Lined Hoodie', price: 2699, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', category: 'Hoodies', description: 'Extra warm fleece lined hoodie. Winter ready.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 85, name: 'College Logo Hoodie', price: 1999, image: 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=400', category: 'Hoodies', description: 'Classic college style hoodie. Campus vibes.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 86, name: 'Half-Zip Hoodie', price: 2399, image: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=400', category: 'Hoodies', description: 'Modern half-zip pullover hoodie. Athletic style.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 87, name: 'Tech Fleece Hoodie', price: 3299, image: 'https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=400', category: 'Hoodies', description: 'Performance tech fleece hoodie. Sports luxury.', sizes: ['S', 'M', 'L', 'XL'] },

  // ============ FOOTWEAR (15 items) ============
  { id: 88, name: 'White Sneakers', price: 3999, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', category: 'Footwear', description: 'Clean white leather sneakers. Minimalist style.', sizes: ['6', '7', '8', '9', '10', '11', '12'] },
  { id: 89, name: 'Running Shoes', price: 5999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Footwear', description: 'Performance running shoes. Lightweight and cushioned.', sizes: ['6', '7', '8', '9', '10', '11', '12'] },
  { id: 90, name: 'Canvas Slip-Ons', price: 1999, image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400', category: 'Footwear', description: 'Casual canvas slip-on shoes. Easy and comfortable.', sizes: ['6', '7', '8', '9', '10', '11'] },
  { id: 91, name: 'Leather Loafers', price: 4499, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400', category: 'Footwear', description: 'Classic leather penny loafers. Sophisticated style.', sizes: ['7', '8', '9', '10', '11', '12'] },
  { id: 92, name: 'High Top Sneakers', price: 4299, image: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400', category: 'Footwear', description: 'Stylish high top sneakers. Street style icon.', sizes: ['6', '7', '8', '9', '10', '11'] },
  { id: 93, name: 'Leather Sandals', price: 1799, image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=400', category: 'Footwear', description: 'Comfortable leather sandals. Summer essential.', sizes: ['6', '7', '8', '9', '10', '11'] },
  { id: 94, name: 'Chelsea Boots', price: 5499, image: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=400', category: 'Footwear', description: 'Sleek leather Chelsea boots. Effortlessly cool.', sizes: ['7', '8', '9', '10', '11', '12'] },
  { id: 95, name: 'Sports Sandals', price: 2499, image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400', category: 'Footwear', description: 'Active sports sandals. Adventure ready.', sizes: ['6', '7', '8', '9', '10', '11'] },
  { id: 96, name: 'Oxford Shoes', price: 4999, image: 'https://images.unsplash.com/photo-1614252234498-4a6a4fafb150?w=400', category: 'Footwear', description: 'Formal leather Oxford shoes. Classic elegance.', sizes: ['7', '8', '9', '10', '11', '12'] },
  { id: 97, name: 'Espadrilles', price: 1499, image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400', category: 'Footwear', description: 'Summer espadrille shoes. Mediterranean style.', sizes: ['6', '7', '8', '9', '10', '11'] },
  { id: 98, name: 'Hiking Boots', price: 6999, image: 'https://images.unsplash.com/photo-1520219306100-ec4afeeefe58?w=400', category: 'Footwear', description: 'Durable hiking boots. Trail tested.', sizes: ['7', '8', '9', '10', '11', '12'] },
  { id: 99, name: 'Platform Sneakers', price: 3499, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400', category: 'Footwear', description: 'Trendy platform sneakers. Height boost.', sizes: ['5', '6', '7', '8', '9', '10'] },
  { id: 100, name: 'Moccasins', price: 2999, image: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=400', category: 'Footwear', description: 'Soft suede moccasins. Comfortable and casual.', sizes: ['7', '8', '9', '10', '11'] },
  { id: 101, name: 'Ankle Boots', price: 4799, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400', category: 'Footwear', description: 'Stylish ankle boots. Versatile footwear.', sizes: ['5', '6', '7', '8', '9', '10'] },
  { id: 102, name: 'Flip Flops', price: 499, image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400', category: 'Footwear', description: 'Casual beach flip flops. Simple comfort.', sizes: ['6', '7', '8', '9', '10', '11'] },

  // ============ ACCESSORIES (15 items) ============
  { id: 103, name: 'Leather Belt', price: 1299, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Accessories', description: 'Classic brown leather belt. Quality craftsmanship.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 104, name: 'Silk Scarf', price: 1999, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400', category: 'Accessories', description: 'Elegant printed silk scarf. Luxurious accessory.', sizes: ['One Size'] },
  { id: 105, name: 'Baseball Cap', price: 799, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400', category: 'Accessories', description: 'Classic cotton baseball cap. Casual essential.', sizes: ['One Size'] },
  { id: 106, name: 'Wool Beanie', price: 699, image: 'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400', category: 'Accessories', description: 'Warm wool knit beanie. Winter warmth.', sizes: ['One Size'] },
  { id: 107, name: 'Leather Wallet', price: 1499, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400', category: 'Accessories', description: 'Genuine leather bi-fold wallet. Organized style.', sizes: ['One Size'] },
  { id: 108, name: 'Sunglasses', price: 2499, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400', category: 'Accessories', description: 'Stylish aviator sunglasses. UV protection.', sizes: ['One Size'] },
  { id: 109, name: 'Watch Classic', price: 4999, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400', category: 'Accessories', description: 'Classic analog wrist watch. Timeless elegance.', sizes: ['One Size'] },
  { id: 110, name: 'Tote Bag', price: 1799, image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400', category: 'Accessories', description: 'Canvas everyday tote bag. Spacious and practical.', sizes: ['One Size'] },
  { id: 111, name: 'Crossbody Bag', price: 2299, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', category: 'Accessories', description: 'Leather crossbody bag. Hands-free convenience.', sizes: ['One Size'] },
  { id: 112, name: 'Bamboo Socks (3-Pack)', price: 499, image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400', category: 'Accessories', description: 'Eco-friendly bamboo fiber socks. Breathable comfort.', sizes: ['S', 'M', 'L'] },
  { id: 113, name: 'Tie Set', price: 1299, image: 'https://images.unsplash.com/photo-1589756823695-278bc923f962?w=400', category: 'Accessories', description: 'Silk tie and pocket square set. Complete look.', sizes: ['One Size'] },
  { id: 114, name: 'Fedora Hat', price: 1599, image: 'https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=400', category: 'Accessories', description: 'Classic wool fedora hat. Sophisticated style.', sizes: ['S', 'M', 'L'] },
  { id: 115, name: 'Backpack', price: 2999, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Accessories', description: 'Durable canvas backpack. Daily carry.', sizes: ['One Size'] },
  { id: 116, name: 'Gloves Leather', price: 1199, image: 'https://images.unsplash.com/photo-1531832553458-7797c51d4e8d?w=400', category: 'Accessories', description: 'Warm leather winter gloves. Cold weather essential.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 117, name: 'Hair Scrunchies (5-Pack)', price: 299, image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400', category: 'Accessories', description: 'Colorful velvet scrunchies set. Gentle on hair.', sizes: ['One Size'] },

  // ============ PANTS (10 items) ============
  { id: 118, name: 'Chino Pants Khaki', price: 1999, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', category: 'Pants', description: 'Classic khaki chino pants. Smart casual essential.', sizes: ['28', '30', '32', '34', '36', '38'] },
  { id: 119, name: 'Formal Trousers', price: 2499, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', category: 'Pants', description: 'Sharp formal dress trousers. Professional look.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 120, name: 'Cargo Pants', price: 2299, image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=400', category: 'Pants', description: 'Utility cargo pants with pockets. Functional style.', sizes: ['28', '30', '32', '34', '36', '38'] },
  { id: 121, name: 'Jogger Pants', price: 1799, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400', category: 'Pants', description: 'Comfortable jogger pants. Athleisure comfort.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 122, name: 'Linen Pants', price: 2199, image: 'https://images.unsplash.com/photo-1594938328870-9623159c8c99?w=400', category: 'Pants', description: 'Breathable linen summer pants. Lightweight feel.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 123, name: 'Track Pants', price: 1499, image: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400', category: 'Pants', description: 'Athletic track pants. Sporty comfort.', sizes: ['S', 'M', 'L', 'XL', 'XXL'] },
  { id: 124, name: 'Corduroy Pants', price: 2399, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400', category: 'Pants', description: 'Retro corduroy trousers. Textured classic.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 125, name: 'Wide Leg Pants', price: 2099, image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400', category: 'Pants', description: 'Trendy wide leg pants. Flowing silhouette.', sizes: ['XS', 'S', 'M', 'L', 'XL'] },
  { id: 126, name: 'Pleated Pants', price: 2699, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', category: 'Pants', description: 'Classic pleated front pants. Refined style.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 127, name: 'Slim Fit Pants', price: 1899, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400', category: 'Pants', description: 'Modern slim fit pants. Tailored look.', sizes: ['28', '30', '32', '34', '36'] },

  // ============ SHORTS (8 items) ============
  { id: 128, name: 'Denim Shorts', price: 1499, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', category: 'Shorts', description: 'Classic denim shorts. Summer staple.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 129, name: 'Chino Shorts', price: 1299, image: 'https://images.unsplash.com/photo-1617952739858-28043cecdae3?w=400', category: 'Shorts', description: 'Smart chino shorts. Polished casual.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 130, name: 'Athletic Shorts', price: 999, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', category: 'Shorts', description: 'Performance athletic shorts. Gym ready.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 131, name: 'Swim Trunks', price: 1199, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', category: 'Shorts', description: 'Quick-dry swim trunks. Beach essential.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 132, name: 'Cargo Shorts', price: 1599, image: 'https://images.unsplash.com/photo-1617952739858-28043cecdae3?w=400', category: 'Shorts', description: 'Utility cargo shorts. Extra pockets.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 133, name: 'Linen Shorts', price: 1399, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400', category: 'Shorts', description: 'Breathable linen shorts. Cool comfort.', sizes: ['28', '30', '32', '34', '36'] },
  { id: 134, name: 'Running Shorts', price: 899, image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=400', category: 'Shorts', description: 'Lightweight running shorts. Performance fit.', sizes: ['S', 'M', 'L', 'XL'] },
  { id: 135, name: 'Board Shorts', price: 1299, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', category: 'Shorts', description: 'Surf style board shorts. Water friendly.', sizes: ['28', '30', '32', '34', '36'] },
];

// Get unique categories
export const categories = ['All', ...new Set(allProducts.map(p => p.category))];

// Get product by ID
export const getProductById = (id) => {
  return allProducts.find(p => p.id === parseInt(id));
};

// Get similar products (same category, excluding current product)
export const getSimilarProducts = (productId, limit = 4) => {
  const product = getProductById(productId);
  if (!product) return [];
  
  return allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
};

// Get products by category
export const getProductsByCategory = (category) => {
  if (category === 'All') return allProducts;
  return allProducts.filter(p => p.category === category);
};
