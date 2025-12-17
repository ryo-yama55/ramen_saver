import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ResistButton } from './ResistButton';

describe('ResistButton', () => {
  describe('正常系', () => {
    it('ボタンが表示される', () => {
      render(<ResistButton onClick={() => {}} />);

      expect(
        screen.getByRole('button', { name: '我慢した!' })
      ).toBeInTheDocument();
    });

    it('クリックするとonClickが呼ばれる', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<ResistButton onClick={handleClick} />);

      const button = screen.getByRole('button', { name: '我慢した!' });
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('複数回クリックできる', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<ResistButton onClick={handleClick} />);

      const button = screen.getByRole('button', { name: '我慢した!' });
      await user.click(button);
      await user.click(button);
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('disabled状態の時はクリックできない', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<ResistButton onClick={handleClick} disabled />);

      const button = screen.getByRole('button', { name: '我慢した!' });
      expect(button).toBeDisabled();

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disabled状態の時は見た目が変わる', () => {
      render(<ResistButton onClick={() => {}} disabled />);

      const button = screen.getByRole('button', { name: '我慢した!' });
      expect(button).toHaveClass('opacity-50');
      expect(button).toHaveClass('cursor-not-allowed');
    });

    it('loading状態の時は"保存中..."と表示される', () => {
      render(<ResistButton onClick={() => {}} loading />);

      expect(
        screen.getByRole('button', { name: '保存中...' })
      ).toBeInTheDocument();
    });

    it('loading状態の時はクリックできない', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<ResistButton onClick={handleClick} loading />);

      const button = screen.getByRole('button', { name: '保存中...' });
      expect(button).toBeDisabled();

      await user.click(button);
      expect(handleClick).not.toHaveBeenCalled();
    });
  });
});
