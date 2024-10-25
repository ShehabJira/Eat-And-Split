import { useState } from "react";
const initialFriends = [
	{
		id: 118836,
		name: "Clark",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Sarah",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Anthony",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

function Button({ children, onClick }) {
	return (
		<button className="button" onClick={onClick}>
			{children}
		</button>
	);
}

export default function App() {
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [friends, setFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleShowAddFriend() {
		setShowAddFriend((show) => !show);
	}
	function handleAddFriend(friend) {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	}
	function handleSelection(friend) {
		setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
		setShowAddFriend(false);
	} //When you pass this function into the deep down to the select button, this is called
	// 'Prop Drilling'

	function handleSplitBill(value) {
		// update the friend balance in the friends array.
		setFriends(
			friends.map((friend) =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend
			)
		);
		setSelectedFriend(null);
	}

	return (
		<div className="app">
			<div className="sidebar">
				<FriendsList
					friends={friends}
					onSelection={handleSelection}
					selectedFriend={selectedFriend}
				/>

				{showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? "Close" : "Add friend"}
				</Button>
			</div>

			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onSplitBill={handleSplitBill}
					key={selectedFriend.id}
				/>
			)}
		</div>
	);
}

function FriendsList({ friends, onSelection, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelection={onSelection}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}
function Friend({ friend, onSelection, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;
	return (
		<li className={`${isSelected ? "selected" : ""}`}>
			<img src={friend.image} alt={friend.name} />

			<h3>{friend.name}</h3>

			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} ${Math.abs(friend.balance)}
				</p>
			)}
			{friend.balance > 0 && (
				<p className="green">
					{friend.name} owes you ${Math.abs(friend.balance)}
				</p>
			)}
			{friend.balance === 0 && <p>You and {friend.name} are even</p>}

			<Button onClick={() => onSelection(friend)}>
				{`${isSelected ? "Close" : "Select"}`}
			</Button>
		</li>
	);
}
function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");
	function handleSubmit(e) {
		e.preventDefault(); // the default of form is to reload the page.

		if (!name || !image) return;

		const id = crypto.randomUUID();
		const newFriend = {
			id,
			name,
			image: `${image}?=${id}`, //Put any words after the image URL to keep the same image constant in the project always. Because this => https://i.pravatar.cc/48 => each time any render happens it will give a different one.
			balance: 0,
		};
		onAddFriend(newFriend);

		setName("");
		setImage("https://i.pravatar.cc/48");
	}
	return (
		<form className="form-add-friend" onSubmit={(e) => handleSubmit(e)}>
			<label>🧑‍🤝‍🧑 Friend name</label>
			<input
				type="text"
				value={name}
				onChange={(e) => setName(e.target.value)}
			></input>

			<label>🌄 Image URL</label>
			<input
				type="text"
				value={image}
				onChange={(e) => setImage(e.target.value)}
			></input>

			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [bill, setBill] = useState("");
	const [userExpense, setUserExpense] = useState("");
	const friendExpense = bill ? bill - userExpense : "";
	const [whoIsPaying, setWhoIsPaying] = useState("user");

	function handleSubmit(e) {
		e.preventDefault();
		if (!bill || !userExpense) return;

		const value = whoIsPaying === "user" ? friendExpense : -userExpense; // If the bill is 200 and my expense is 50 and my friend expense is 150, and I paid the whole bill, then my friend owes me with his expense and we return it in positive value to make him owes me. But if he paid the whole bill then I owe him with my expense, and we return it in negative to make me owe him.
		onSplitBill(value);
	}

	return (
		<form className="form-split-bill" onSubmit={(e) => handleSubmit(e)}>
			<h2>Split a bill with {selectedFriend.name}</h2>

			<label>💰 Bill value</label>
			<input
				type="text"
				value={bill}
				onChange={(e) => setBill(+e.target.value)}
			></input>

			<label>🧍Your expense</label>
			<input
				type="text"
				value={userExpense}
				onChange={(e) =>
					setUserExpense(+e.target.value > bill ? userExpense : +e.target.value)
				}
			></input>

			<label>🧑‍🤝‍🧑 {selectedFriend.name}'s expense</label>
			<input type="text" disabled value={friendExpense}></input>

			<label>🤑 Who is paying the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value="friend">{selectedFriend.name}</option>
			</select>
			<Button>Split bill</Button>
		</form>
	);
}
