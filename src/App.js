import './App.css';
import {Auth} from "./auth";
import {db, auth} from "./firebase-config";
import {useEffect, useState} from "react";
import {doc, getDocs, collection, query, where, addDoc, deleteDoc, updateDoc} from "firebase/firestore";

function App() {
  //current ones available on screen
  const [foodsAvail, setFoodsAvail] = useState([]);
  const [cart, setCart] = useState([]);
  const [buyerList, setBuyerList] = useState([]);

  //ships this to database
  const [newFood, setNewFood] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newTime, setNewTime] = useState("");

  //references to database
  const foodsCollectionRef =  query(collection(db, "food-data"));
  const buyersCollectionRef = query(collection(db, "food-data"), 
    where("seller", "!=", localStorage.getItem("email")), where("buyer", "==", "NA"));
  const getCartRef = query(collection(db, "food-data"),  
    where("buyer", "==", localStorage.getItem("email")));
  const sellersCollectionRef =  query(collection(db, "food-data"),
    where("seller", "==", localStorage.getItem("email")));


  //updates current foods from database
  const getListFoods = async() => {
    try{
      const data = await getDocs(buyersCollectionRef);
      const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id,}));
      setFoodsAvail(filteredData);
    } catch(err) {console.error(err);}
  };

  const getListCart= async() => {
    try{
      const data = await getDocs(getCartRef);
      const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id,}));
      setCart(filteredData);
    } catch(err) {console.error(err);}
  };

  const getBuyerList= async() => {
    try{
      const data = await getDocs(sellersCollectionRef);
      const filteredData = data.docs.map((doc) => ({...doc.data(), id: doc.id,}));
      setBuyerList(filteredData);
    } catch(err) {console.error(err);}
  };

  //adds food entry 
  const submitNewFood = async() => {
    try{
      await addDoc(foodsCollectionRef, {
        foodName: newFood, price: newPrice, time: newTime, seller: localStorage.getItem("email"), buyer: "NA"})
        getListFoods(); getListCart(); getBuyerList();
    } catch(err) {console.err(err);}
  }

  //add food to cart
  const addFoodToCart = async(id) => {
    try{
      const ref = doc(db, "food-data", id);
      await updateDoc(ref, {buyer: localStorage.getItem("email")})
      getListFoods(); getListCart(); getBuyerList();
    } catch(err) {console.err(err);}
  };

  const deleteFromCart = async(id) => {
    try{
      const ref = doc(db, "food-data", id);
      await updateDoc(ref, {buyer: "NA"})
      getListFoods(); getListCart(); getBuyerList();
    } catch(err) {console.err(err);}
  };

  //deletes food when by passing id
  const deleteFood = async(docu, id) => {
    const foodDoc = doc(db, docu, id);
    await deleteDoc(foodDoc);
    getListFoods(); getListCart(); getBuyerList();
  };

  useEffect(() => {
    getListFoods();
    getListCart();
    getBuyerList();
  }, [])

  //current UI
  return (
    <div className="App">
      <Auth/>
      <div>
        <input placeholder="Add Food To Sell" onChange={(e) => setNewFood(e.target.value)}></input>
        <input placeholder="Set Price" onChange={(e) => setNewPrice(e.target.value)}></input>
        <input placeholder="Add Date" onChange={(e) => setNewTime(e.target.value)}></input>
        <button onClick={submitNewFood}>Submit Food To Sell</button>
      </div>

      <h1>Hello! {localStorage.getItem("name")}</h1>

      <div>
      <h1>Foods Available</h1>
        {foodsAvail.map((food) => (
          <div>
            <h1>Food: {food.foodName}</h1>
            <p>Food price: {food.price}</p>
            <p>Time: {food.time}</p>
            <button onClick={() => addFoodToCart(food.id)}>Add To Cart</button>
          </div>
        ))}
      </div>

      <div>
      <h1>Currrent Cart</h1>
      {cart.map((food) => (
        
          <div>
            <p>Food{food.foodName}</p>
            <p>Food price: {food.price}</p>
            <p>Time: {food.time}</p>
            <button onClick={() => deleteFromCart(food.id)}>Delete From Cart</button>
          </div>
        ))} 
      </div>

      <div>
      <h1>Items Selling</h1>
      {buyerList.map((food) => (
        
          <div>
            <p>Food{food.foodName}</p>
            <p>Food price: {food.price}</p>
            <p>Time: {food.time}</p>
            <button onClick={() => deleteFood("food-data",food.id)}>Delete/Cancel Listing</button>
          </div>
        ))} 
      </div>
      
      </div>
  );
}

export default App;
