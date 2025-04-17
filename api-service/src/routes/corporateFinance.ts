import express from 'express';
import { CorporateFinanceContent } from '../../src/types';

const router = express.Router();

// In-memory storage (replace with database in production)
let corporateFinanceContent: CorporateFinanceContent[] = [];

// Get all content
router.get('/', (req, res) => {
  res.json(corporateFinanceContent);
});

// Get content by ID
router.get('/:id', (req, res) => {
  const content = corporateFinanceContent.find(item => item.id === req.params.id);
  if (!content) {
    return res.status(404).json({ error: 'Content not found' });
  }
  res.json(content);
});

// Create new content
router.post('/', (req, res) => {
  const newContent: CorporateFinanceContent = {
    ...req.body,
    id: Date.now().toString(),
  };
  corporateFinanceContent.push(newContent);
  res.status(201).json(newContent);
});

// Update content
router.put('/:id', (req, res) => {
  const index = corporateFinanceContent.findIndex(item => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Content not found' });
  }
  corporateFinanceContent[index] = {
    ...corporateFinanceContent[index],
    ...req.body,
  };
  res.json(corporateFinanceContent[index]);
});

// Delete content
router.delete('/:id', (req, res) => {
  const index = corporateFinanceContent.findIndex(item => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Content not found' });
  }
  corporateFinanceContent.splice(index, 1);
  res.status(204).send();
});

export default router; 