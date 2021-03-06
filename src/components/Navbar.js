import React, { useState, useEffect, useRef} from 'react'
import { useHistory } from 'react-router-dom'
import AuthModal from './AuthModal'
import { logOutUser } from './Firebase'
import '../styles/Navbar.css'

const Navbar = ({
	isLoggedIn,
	setIsLoggedIn,
	loggedInUser,
	setLoggedInUser,
}) => {
	const ref = useRef()

	const history = useHistory()

	const [modalOpen, setModalOpen] = useState(false)
	const [signInTime, setSignInTime] = useState(true)
	const [openDropdown, setOpenDropdown] = useState(false)
	
  useEffect(() => {
		const checkIfClickedOutside = (e) => {
			// If the menu is open and the clicked target is not within the menu,

			// then close the menu

			if (openDropdown && ref.current && !ref.current.contains(e.target)) {
				setOpenDropdown(false)
			}
		}

		document.addEventListener('mousedown', checkIfClickedOutside)

		return () => {
			// Cleanup the event listener

			document.removeEventListener('mousedown', checkIfClickedOutside)
		}
  }, [openDropdown])

	const handleSignInClick = () => {
		setModalOpen(!modalOpen)
		setSignInTime(true)
	}
	const handleSignUpClick = () => {
		setModalOpen(!modalOpen)
		setSignInTime(false)
	}

	const handleLogInSignUpClick = () => {
		setModalOpen(!modalOpen)
		setOpenDropdown(!openDropdown)
	}

	const handleNewPostClick = () => {
		history.push('/fakeddit/submit')
		setOpenDropdown(!openDropdown)
	}

	const handleSignOut = () => {
		logOutUser()
		setIsLoggedIn(!isLoggedIn)
		setOpenDropdown(!openDropdown)
		localStorage.setItem('loggedIn', false)
		setLoggedInUser(null)
		localStorage.setItem('user', null)
	}

	return (
		<nav>
			<div className='logo-container'>
				<button
					type='button'
					className='logo-button'
					onClick={() => history.push('/fakeddit/')}
				/>
				<p>fakeddit</p>
			</div>

			<form className='nav-form'>
				<img
					src={require('../images/search.png').default}
					alt={'search'}
				/>
				<input
					className='nav-search'
					placeholder='Fake search Fakeddit'></input>
			</form>

			<div className='nav-buttons-container'>
				{!isLoggedIn && (
					<div className='nav-buttons'>
						<button
							type='button'
							className='nav-log-in'
							onClick={handleSignInClick}>
							Log In
						</button>
						<button
							type='button'
							className='nav-sign-up'
							onClick={handleSignUpClick}>
							Sign up
						</button>
					</div>
				)}

				<div className='nav-user-buttons' ref={ref}>
					<button
						type='button'
						className='nav-user-icon'
						onClick={() => setOpenDropdown(!openDropdown)}
					/>

					{openDropdown && (
						<div className='dropdown-container'>
							{isLoggedIn && (
								<div>
									<button
										type='button'
										onClick={handleNewPostClick}
										className='dropdown-button'>
										Create a post
									</button>
									<button
										type='button'
										onClick={handleSignOut}
										className='dropdown-button'>
										Sign out
									</button>
								</div>
							)}
							{!isLoggedIn && (
								<div>
									<button
										type='button'
										className='dropdown-button'
										onClick={handleLogInSignUpClick}>
										Log In / Sign Up
									</button>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<AuthModal
				modalOpen={modalOpen}
				setModalOpen={setModalOpen}
				signInTime={signInTime}
				setSignInTime={setSignInTime}
				isLoggedIn={isLoggedIn}
				setIsLoggedIn={setIsLoggedIn}
				loggedInUser={loggedInUser}
				setLoggedInUser={setLoggedInUser}
			/>
		</nav>
	)
}

export default Navbar