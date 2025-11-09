import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from '../../components/UserProfile';
import { UserProvider } from '../../context/UserContext';
import { BrowserRouter } from 'react-router-dom';

// Mock API calls
jest.mock('../../api/userApi', () => ({
  getUserProfile: jest.fn(() => 
    Promise.resolve({
      data: {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://example.com/avatar.jpg'
        }
      }
    })
  ),
  updateUserProfile: jest.fn(() => 
    Promise.resolve({
      data: {
        user: {
          id: '1',
          name: 'Updated Name',
          email: 'updated@example.com'
        }
      }
    })
  )
}));

describe('UserProfile Integration Test', () => {
  const renderWithProviders = (component) => {
    return render(
      <BrowserRouter>
        <UserProvider>
          {component}
        </UserProvider>
      </BrowserRouter>
    );
  };

  it('should load and display user profile', async () => {
    renderWithProviders(<UserProfile />);

    // Check loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
    });
  });

  it('should update user profile', async () => {
    renderWithProviders(<UserProfile />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Simulate user interactions
    const editButton = screen.getByText('Edit Profile');
    editButton.click();

    const nameInput = screen.getByLabelText('Name');
    const saveButton = screen.getByText('Save Changes');

    // Update name and save
    await userEvent.type(nameInput, 'Updated Name');
    saveButton.click();

    await waitFor(() => {
      expect(screen.getByText('Profile updated successfully')).toBeInTheDocument();
    });
  });
});