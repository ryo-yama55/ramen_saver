import type { Meta, StoryObj } from '@storybook/react';
import { ResistButton } from './ResistButton';

const meta = {
  title: 'Home/ResistButton',
  component: ResistButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof ResistButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
    loading: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    disabled: false,
    loading: true,
  },
};
