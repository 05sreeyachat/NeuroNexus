import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Button, Card, CardContent, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, LinearProgress, Tab, Tabs, Tooltip, Avatar, AvatarGroup } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Schedule as ScheduleIcon, Flag as FlagIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Todo',
    deadline: ''
  });

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newTask)
      });
      setOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'High': '#f44336',
      'Medium': '#ff9800',
      'Low': '#4caf50'
    };
    return colors[priority] || '#757575';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Todo': '#9e9e9e',
      'In Progress': '#2196f3',
      'Done': '#4caf50'
    };
    return colors[status] || '#757575';
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ 
          color: '#1a237e', 
          fontWeight: 600,
          background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Tasks Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
            boxShadow: '0 3px 5px 2px rgba(83, 75, 174, .3)',
            color: 'white',
            padding: '10px 30px'
          }}
        >
          New Task
        </Button>
      </Box>

      <Tabs
        value={filter}
        onChange={(e, newValue) => setFilter(newValue)}
        sx={{ mb: 4, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab 
          label="All Tasks" 
          value="all"
          sx={{ 
            '&.Mui-selected': { 
              color: '#1a237e',
              fontWeight: 600
            }
          }}
        />
        <Tab 
          label="Todo" 
          value="todo"
          sx={{ 
            '&.Mui-selected': { 
              color: '#1a237e',
              fontWeight: 600
            }
          }}
        />
        <Tab 
          label="In Progress" 
          value="in progress"
          sx={{ 
            '&.Mui-selected': { 
              color: '#1a237e',
              fontWeight: 600
            }
          }}
        />
        <Tab 
          label="Completed" 
          value="done"
          sx={{ 
            '&.Mui-selected': { 
              color: '#1a237e',
              fontWeight: 600
            }
          }}
        />
      </Tabs>

      <Grid container spacing={3}>
        {filteredTasks.map((task) => (
          <Grid item xs={12} md={6} key={task._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                },
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {task.title}
                  </Typography>
                  <Box>
                    <Tooltip title="Edit Task">
                      <IconButton size="small">
                        <EditIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Task">
                      <IconButton size="small" color="error">
                        <DeleteIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {task.description}
                </Typography>

                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Chip
                    icon={<FlagIcon sx={{ fontSize: 18 }} />}
                    label={task.priority}
                    sx={{
                      bgcolor: getPriorityColor(task.priority),
                      color: 'white',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                  <Chip
                    icon={<CheckCircleIcon sx={{ fontSize: 18 }} />}
                    label={task.status}
                    sx={{
                      bgcolor: getStatusColor(task.status),
                      color: 'white',
                      fontWeight: 500,
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <ScheduleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      Due: {new Date(task.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.8rem' } }}>
                    <Avatar alt="User 1" src="/user1.jpg" />
                    <Avatar alt="User 2" src="/user2.jpg" />
                    <Avatar alt="User 3" src="/user3.jpg" />
                  </AvatarGroup>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={task.status === 'Done' ? 100 : task.status === 'In Progress' ? 50 : 0}
                  sx={{
                    mt: 2,
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getStatusColor(task.status)
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ 
          pb: 1,
          background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
          color: 'white'
        }}>
          Create New Task
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Task Title"
              margin="normal"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={4}
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <TextField
              fullWidth
              select
              label="Priority"
              margin="normal"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              {['Low', 'Medium', 'High'].map((priority) => (
                <MenuItem key={priority} value={priority}>{priority}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              select
              label="Status"
              margin="normal"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
            >
              {['Todo', 'In Progress', 'Done'].map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Deadline"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: 'linear-gradient(45deg, #1a237e 30%, #534bae 90%)',
              boxShadow: '0 3px 5px 2px rgba(83, 75, 174, .3)',
            }}
          >
            Create Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Tasks;