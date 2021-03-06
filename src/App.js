import React, { useEffect, useState }from 'react'
import './styles/App.css'
import Navbar from './components/Navbar'
import Hot from './components/Hot'
import Best from './components/Best'
import New from './components/New'
import Submit from './components/Submit'
import { getComments, getPost } from './components/Firebase'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import FullPost from './components/FullPost'

const App = () => {

	const loggedStatus = JSON.parse(localStorage.getItem('loggedIn'))

	const [isLoggedIn, setIsLoggedIn] = useState(loggedStatus)

	const loggedInUserName = localStorage.getItem('user')
	
	const [loggedInUser, setLoggedInUser] = useState(loggedInUserName)

	const [storedPosts, setStoredPosts] = useState([])

	const [comments, setComments] = useState([])

	const getDbPost = async () => {
		const post = await getPost()
		post.forEach((doc) => {
			if (doc.data().imgUrl) {
				setStoredPosts((prevState) => [
					...prevState,
					{
						title: doc.id,
						imgUrl: doc.data().imgUrl,
						author: doc.data().author,
						upvotes: doc.data().upvotes,
						date: doc.data().date.toDate(),
					},
				])
			} else if (doc.data().url) {
				setStoredPosts((prevState) => [
					...prevState,
					{
						title: doc.id,
						url: doc.data().url,
						author: doc.data().author,
						upvotes: doc.data().upvotes,
						date: doc.data().date.toDate(),
					},
				])			
			} else {
				setStoredPosts((prevState) => [
					...prevState,
					{
						title: doc.id,
						text: doc.data().text,
						author: doc.data().author,
						upvotes: doc.data().upvotes,
						date: doc.data().date.toDate(),
					},
				])
			}
		})
	}
	
	const getDbComments = async () => {
		const comment = await getComments()
		comment.forEach((doc) => {
			setComments((prevState) => [
				...prevState,
				{
					post: doc.data().post,
					author: doc.data().author,
					text: doc.data().text,
					date: doc.data().date.toDate(),
					upvotes: doc.data().upvotes,
				},
			])
		})
	}

	useEffect(() => {
		// rendering posts and comments stored in firebase
		getDbPost()
		getDbComments()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className='container'>
			<BrowserRouter basename='/'>
				<Navbar
					isLoggedIn={isLoggedIn}
					setIsLoggedIn={setIsLoggedIn}
					loggedInUser={loggedInUser}
					setLoggedInUser={setLoggedInUser}
				/>

				<Switch>
					<Route
						exact
						path='/fakeddit/hot'
						render={() => (
							<Hot
								isLoggedIn={isLoggedIn}
								storedPosts={storedPosts}
								setStoredPosts={setStoredPosts}
								comments={comments}
								loggedInUser={loggedInUser}
							/>
						)}
					/>
					<Route
						exact
						path='/fakeddit/'
						render={() => (
							<Best
								isLoggedIn={isLoggedIn}
								storedPosts={storedPosts}
								setStoredPosts={setStoredPosts}
								comments={comments}
								loggedInUser={loggedInUser}
							/>
						)}
					/>

					<Route
						exact
						path='/fakeddit/new'
						render={() => (
							<New
								isLoggedIn={isLoggedIn}
								storedPosts={storedPosts}
								setStoredPosts={setStoredPosts}
								comments={comments}
								loggedInUser={loggedInUser}
							/>
						)}
					/>

					<Route
						exact
						path='/fakeddit/submit'
						render={() => (
							<Submit
								loggedInUser={loggedInUser}
								storedPosts={storedPosts}
								setStoredPosts={setStoredPosts}
								isLoggedIn={isLoggedIn}
							/>
						)}
					/>

					<Route
						exact
						path='/fakeddit/:id'
						render={() => (
							<FullPost
								isLoggedIn={isLoggedIn}
								storedPosts={storedPosts}
								setStoredPosts={setStoredPosts}
								comments={comments}
								setComments={setComments}
								loggedUser={loggedInUser}
							/>
						)}
					/>
				</Switch>
			</BrowserRouter>
		</div>
	)
}

export default App;
