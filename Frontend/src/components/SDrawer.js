import { Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Toolbar, Collapse } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import React, { useState } from "react";

import Face6Icon from '@mui/icons-material/Face6';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
const drawerWidth = 240;
const initial_menuItems = [
  {
    
    menuTitle: "Student",
    visible: true,
    enteries: [{
      title: "All students",
      path: '/admin/students',
      icon: <Face6Icon />
    },
    {
      title: "New Student",
      path: '/admin/students/addNew',
      icon: <AddIcon />
    },
    {
      title: "Calendar",
      path: '/admin/calendar',
      icon: <CalendarMonthIcon />
    }
    ]
  },

  {
    menuTitle: "Teacher",
    visible: true,
    enteries: [{
      title: "All students",
      path: '/admin/students',
      icon: <Face6Icon />
    },
    {
      title: "New Teacher",
      path: '/admin/teachers/new',
      icon: <AddIcon />
    },
    {
      title: "Calendar",
      path: '/admin/calendar',
      icon: <CalendarMonthIcon />
    }
    ]
  },

  {
    menuTitle: "Exams",
    visible: true,
    enteries: [{
      title: "All Exams",
      path: '/admin/students',
      icon: <Face6Icon />
    },
    {
      title: "New Exam",
      path: '/admin/teachers',
      icon: <AddIcon />
    },
    {
      title: "Calendar",
      path: '/admin/calendar',
      icon: <CalendarMonthIcon />
    }
    ]
  }


]


const SDrawer = (props) => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState(initial_menuItems);

  const updateMenuItemsVisibility = (index) => {
    let temp_menu_items = menuItems;
    temp_menu_items[index].visible = !temp_menu_items[index].visible;
    setMenuItems(temp_menu_items);
  }

  const { mobileOpen } = props;
  const { handleDrawerToggle } = props;

  const handleSideBarClick = (path) => {
    if (mobileOpen) handleDrawerToggle();
    navigate(path, { replace: true });
  }
  const [studentMenuOpen, setStudentMenuOpen] = React.useState(true);

  const handleStudentMenuClick = (index) => {
    updateMenuItemsVisibility(index);
    setStudentMenuOpen(!studentMenuOpen);
  };

  return (
    <div>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List >

          {menuItems.map((menu, index) => (
            <>
              <ListItemButton onClick={()=>handleStudentMenuClick(index)}>
                <ListItemText primary={menu.menuTitle} />
                {menu.visible ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={menu.visible} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                  {menu.enteries.map(item => (
                    <>
                      <ListItem button key={item.title} onClick={() => handleSideBarClick(item.path)} sx={{ pl: 4 }}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItem>
                    </>
                  ))}
                </List>
              </Collapse>
            </>
          ))}

        </List>
      </Drawer>


      
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>

          {menuItems.map((menu, index) => (
            <>
              <ListItemButton onClick={()=>handleStudentMenuClick(index)}>
                <ListItemText primary={menu.menuTitle} />
                {menu.visible ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={menu.visible} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                  {menu.enteries.map(item => (
                    <>
                      <ListItem button key={item.title} onClick={() => handleSideBarClick(item.path)} sx={{ pl: 4 }}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItem>
                    </>
                  ))}
                </List>
              </Collapse>
            </>
          ))}

        </List>
      </Drawer>

    </div>
  );
};

export default SDrawer;