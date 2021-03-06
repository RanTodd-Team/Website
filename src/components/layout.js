import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { Navbar, Container, Nav } from 'react-bootstrap'
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button'
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog'
import { useBoolean } from '@fluentui/react-hooks'
import { navigate } from 'gatsby-link'
import 'bootstrap/dist/css/bootstrap.min.css'

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
     query SiteTitleQuery {
       site {
         siteMetadata {
           title
           menuLinks {
            name
            link
           }
         }
       }
     }
   `)

   const [loggedInUser, setLoggedInUser] = useState(undefined)

   const modelProps = {
     isBlocking: false,
     styles: { main: { maxWidth: 450 } },
   }
   const dialogContentProps = {
     type: DialogType.normal,
     title: 'Sign out?',
     subText: 'Signing out will disable some features until you sign in again.',
   }
 
   const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true)
 
   useEffect(() => {
     if (localStorage.getItem('token')) {
       fetch('https://discord.com/api/v9/users/@me', {
         headers: {
           'Authorization': 'Bearer ' + localStorage.getItem('token')
         }
       })
         .then(res => res.json())
         .then(result => {
           setLoggedInUser(result)
         }
         )
     }
 
   }, [])

  return (
    <>
      <Navbar id="navbar" bg="custom" variant="custom" expand="lg">
      <Container>
        <Navbar.Brand href="/">{data.site.siteMetadata.title}</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav>
            {data.site.siteMetadata.menuLinks.map(link => (
              <Nav.Link href={link.link} key={link.name} active={typeof window !== 'undefined' && window.location.pathname === link.link}>{link.name}</Nav.Link>
            ))}
            <button className="ms-auto antiButton" onClick={() => {
              if (!loggedInUser) {
                navigate("https://discord.com/api/oauth2/authorize?client_id=889281672988749855&redirect_uri=" + encodeURIComponent(window.location.origin + "/") + "callback&response_type=code&scope=guilds%20identify")
              } else {
                toggleHideDialog()
              }
            }}>
              <img src={loggedInUser ? ("https://cdn.discordapp.com/avatars/" + loggedInUser.id + "/" + loggedInUser.avatar + ".png?size=1024") : "https://cdn.discordapp.com/embed/avatars/1.png"} alt="" className="avatarMenu"></img>
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
        modalProps={modelProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={() => {
            localStorage.removeItem("token")
            window.location.reload()
          }} text="Sign out" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </Navbar>
      <div className="container-fluid">{children}</div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout