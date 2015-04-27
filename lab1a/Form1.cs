using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;

namespace lab2CG
{
    public partial class Form1 : Form
    {

        Bitmap bitmap, tmp;


        int[] r;
        int[] g;
        int[] b;
        const int SIZE = 256;
        int brScrollValue;
        public Form1()
        {

            r = new int[SIZE];
            g = new int[SIZE];
            b = new int[SIZE];
            brScrollValue = 0;
            InitializeComponent();
        }

        private void getPixels()
        {
            Size size = tmp.Size;
            Color rgb;
            for (int i = 0; i < SIZE; i++)
            {
                r[i] = 0;
                g[i] = 0;
                b[i] = 0;
            }

            for (int i = 0; i < size.Height; i++)
                for (int j = 0; j < size.Width; j++)
                {
                    rgb = tmp.GetPixel(j, i);
                    r[rgb.R]++;
                    g[rgb.G]++;
                    b[rgb.B]++;
                }
            labelR.Text = "Red average: " + GetAverage(r);
            labelG.Text = "Green average: " + GetAverage(g);
            labelB.Text = "Blue average: " + GetAverage(b);
            pictureBoxR.CreateGraphics().Clear(SystemColors.Control);
            pictureBoxG.CreateGraphics().Clear(SystemColors.Control);
            pictureBoxB.CreateGraphics().Clear(SystemColors.Control);
            Invalidate();
        }

        private int max(int[] array)
        {
            int max = 0;
            for (int i = 0; i < SIZE; i++)
                if (array[i] > max)
                    max = array[i];
            return max;

        }

        private double GetAverage(int[] array)
        {
            double sum = 0, amount = 0;
            for (int i = 0; i < SIZE; i++)
            {
                sum += array[i] * i;
                amount += array[i];
            }
            return sum / amount;
        }

        private void DrawHist(Color rgb, int[] array, PictureBox pb)
        {
            int m = max(array);
            Pen pen = new Pen(rgb);
            if (m != 0)
                for (int i = 0; i < pb.Width; ++i)
                    pb.CreateGraphics().DrawLine(pen, new Point(i, pb.Height),
                                    new Point(i, (int)(pb.Height - (double)pb.Height * array[(int)((double)i * SIZE / pb.Width)] / m)));
           

        }

        private void buttonOpen_Click(object sender, EventArgs e)
        {
            OpenFileDialog ofd = new OpenFileDialog();

            ofd.InitialDirectory = "d:\\projects\\КГ\\lab2_testPic";
            ofd.Filter = "All files (*.*)|*.*";
            ofd.FilterIndex = 2;
            ofd.RestoreDirectory = true;
            if (ofd.ShowDialog() == DialogResult.OK)
            {
                Stream stream = null;
                try
                {
                    if ((stream = ofd.OpenFile()) != null)
                    {
                        bitmap = new Bitmap(stream);
                        //bitmap = new Bitmap(new Bitmap(stream), labelPalette.Width, labelPalette.Height);
                        labelPalette.Image = bitmap;
                        tmp = new Bitmap(bitmap);
                        getPixels();
                        

                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show("Error: Could not read file from disk. Original error: " + ex.Message);
                }
            }
        }

        private void Form1_Paint(object sender, PaintEventArgs e)
        {
            DrawHist(Color.Red, r, pictureBoxR);
            DrawHist(Color.Green, g, pictureBoxG);
            DrawHist(Color.Blue, b, pictureBoxB);
        }

        private int Truncate(int value){
      if (value < 0)  value = 0;
      if (value > 255) value = 255;
      return value;
        }
    }
}
