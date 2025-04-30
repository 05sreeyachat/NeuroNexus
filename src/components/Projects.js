import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Box, Button, Card, CardContent, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, LinearProgress } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Schedule as ScheduleIcon, Group as GroupIcon } from '@mui/icons-material';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    status: 'In Progress',
    deadline: ''
  });

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProjects(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    try {
      await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newProject)
      });
      setOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Completed': '#4caf50',
      'In Progress': '#2196f3',
      'On Hold': '#ff9800',
      'Cancelled': '#f44336'
    };
    return colors[status] || '#757575';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600,
          background: 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(45deg, #90caf9 30%, #42a5f5 90%)',
            boxShadow: '0 3px 5px 2px rgba(144, 202, 249, .3)',
            color: '#000',
            padding: '10px 30px'
          }}
        >
          New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} key={project._id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    {project.title}
                  </Typography>
                  <Box>
                    <IconButton size="small">
                      <EditIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <DeleteIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Chip
                    label={project.status}
                    sx={{
                      bgcolor: getStatusColor(project.status),
                      color: 'white',
                      fontWeight: 500
                    }}
                  />
                  <Box display="flex" alignItems="center" gap={1}>
                    <ScheduleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(project.deadline).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <GroupIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="caption" color="text.secondary">
                      {project.members?.length || 0} members
                    </Typography>
                  </Box>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={project.status === 'Completed' ? 100 : 70}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: 'rgba(0,0,0,0.1)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getStatusColor(project.status)
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ pb: 1 }}>Create New Project</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Project Title"
              margin="normal"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              margin="normal"
              multiline
              rows={4}
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            />
            <TextField
              fullWidth
              select
              label="Status"
              margin="normal"
              value={newProject.status}
              onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
            >
              {['In Progress', 'Completed', 'On Hold', 'Cancelled'].map((status) => (
                <MenuItem key={status} value={status}>{status}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Deadline"
              type="date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={newProject.deadline}
              onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #21cbf3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            }}
          >
            Create Project
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects;