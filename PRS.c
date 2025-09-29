#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <math.h>

#define MAX_PRODUCTS 100
#define MAX_REVIEWS 50
#define MAX_STR_LEN 100

typedef struct {
    char customerID[MAX_STR_LEN];
    char review[MAX_STR_LEN];
    float rating;
} ReviewEntry;

typedef struct Product {
    char productID[MAX_STR_LEN];
    char name[MAX_STR_LEN];
    ReviewEntry reviews[MAX_REVIEWS];
    int reviewCount;
    float avgRating;
} Product;

typedef struct {
    char customerID[MAX_STR_LEN];
    char name[MAX_STR_LEN];
} Customer;

Product products[MAX_PRODUCTS];
int productCount = 0;

Customer customers[MAX_PRODUCTS];
int customerCount = 0;

void normalizeID(char *id) {
    for (int i = 0; id[i]; i++)
        id[i] = toupper((unsigned char)id[i]);
}

Customer* findCustomer(const char *id) {
    for (int i = 0; i < customerCount; i++)
        if (strcasecmp(customers[i].customerID, id) == 0)
            return &customers[i];
    return NULL;
}

Product* findProduct(const char *id) {
    for (int i = 0; i < productCount; i++)
        if (strcasecmp(products[i].productID, id) == 0)
            return &products[i];
    return NULL;
}

void addCustomer() {
    if (customerCount >= MAX_PRODUCTS) {
        printf("Customer limit reached!\n");
        return;
    }
    char id[MAX_STR_LEN], name[MAX_STR_LEN];
    printf("Enter New Customer ID: ");
    scanf("%s", id);
    normalizeID(id);
    if (findCustomer(id)) {
        printf("Customer ID already exists!\n");
        return;
    }
    printf("Enter Name: ");
    scanf(" %[^\n]", name);
    strcpy(customers[customerCount].customerID, id);
    strcpy(customers[customerCount].name, name);
    customerCount++;
    printf("Customer added successfully.\n");
}

void addProductReview(char *pid, char *pname, char *cid, float rating, char *review) {
    Customer *c = findCustomer(cid);
    if (!c) { printf("Customer not found!\n"); return; }
    Product *p = findProduct(pid);
    if (!p) {
        if (productCount >= MAX_PRODUCTS) { printf("Max products reached.\n"); return; }
        p = &products[productCount++];
        strcpy(p->productID, pid);
        strcpy(p->name, pname);
        p->reviewCount = 0;
        p->avgRating = 0;
    }
    int sameRatingCount = 0;
    for (int i = 0; i < p->reviewCount; i++)
        if (strcasecmp(p->reviews[i].customerID, cid) == 0 &&
            fabs(p->reviews[i].rating - rating) < 1e-3)
            sameRatingCount++;
    if (sameRatingCount >= 3) {
        printf("Rating overloaded! You cannot add this rating more than 3 times.\n");
        return;
    } else if (sameRatingCount > 0) {
        char choiceYN;
        printf("You have already entered this rating %d time(s). Do you want to add another rating? (Y/N): ", sameRatingCount);
        scanf(" %c", &choiceYN);
        if (!(choiceYN == 'Y' || choiceYN == 'y')) {
            printf("Rating not added.\n");
            return;
        }
    }
    if (p->reviewCount >= MAX_REVIEWS) { printf("Max reviews reached.\n"); return; }
    strcpy(p->reviews[p->reviewCount].customerID, cid);
    strcpy(p->reviews[p->reviewCount].review, review);
    p->reviews[p->reviewCount].rating = rating;
    p->reviewCount++;
    float sum = 0;
    for (int i = 0; i < p->reviewCount; i++)
        sum += p->reviews[i].rating;
    p->avgRating = sum / p->reviewCount;
    printf("Review added.\n");
}

void searchProduct() {
    char pid[MAX_STR_LEN];
    printf("Enter Product ID: ");
    scanf("%s", pid);
    normalizeID(pid);
    Product *p = findProduct(pid);
    if (!p) { printf("Product not found!\n"); return; }
    printf("Product: %s | Name: %s | Avg Rating: %.2f\n", p->productID, p->name, p->avgRating);
}

void displayTopRated() {
    int n;
    printf("Enter number of top products: ");
    scanf("%d", &n);
    if (n <= 0 || n > productCount) { printf("Invalid number!\n"); return; }
    Product *sorted[MAX_PRODUCTS];
    for (int i = 0; i < productCount; i++)
        sorted[i] = &products[i];
    for (int i = 0; i < productCount - 1; i++)
        for (int j = 0; j < productCount - i - 1; j++)
            if (sorted[j]->avgRating < sorted[j + 1]->avgRating) {
                Product *temp = sorted[j];
                sorted[j] = sorted[j + 1];
                sorted[j + 1] = temp;
            }
    printf("Top %d Products:\n", n);
    for (int i = 0; i < n; i++)
        printf("%s | %s | %.2f\n", sorted[i]->productID, sorted[i]->name, sorted[i]->avgRating);
}

int main() {
    int choice;
    char cid[MAX_STR_LEN], pid[MAX_STR_LEN], pname[MAX_STR_LEN], review[MAX_STR_LEN];
    float rating;
    printf("\t\t\tProduct Review System\t\t\t\t\n");
    while (1) {
        printf("\n1. Login\n2. Signup\nChoice: ");
        scanf("%d", &choice);
        if (choice == 2) { addCustomer(); continue; }
        else if (choice == 1) {
            printf("Enter Customer ID: ");
            scanf("%s", cid);
            normalizeID(cid);
            if (!findCustomer(cid)) { printf("Customer not found!\n"); continue; }
            while (1) {
                printf("\n1.Add Review/Rating  2.Search Product  3.Top Rated  4.Logout\nChoice: ");
                int ch;
                scanf("%d", &ch);
                switch (ch) {
                    case 1: 
                        printf("Enter Product ID: "); scanf("%s", pid); normalizeID(pid);
                        printf("Enter Product Name: "); scanf(" %[^\n]", pname);
                        printf("Enter Rating (1-5): "); scanf("%f", &rating);
                        char choiceYN; review[0]='\0';
                        printf("Do you want to add a review? (Y/N): ");
                        scanf(" %c", &choiceYN);
                        if (choiceYN=='Y'||choiceYN=='y'){ printf("Enter Review: "); scanf(" %[^\n]", review);}
                        addProductReview(pid, pname, cid, rating, review);
                        break;
                    case 2: searchProduct(); break;
                    case 3: displayTopRated(); break;
                    case 4: printf("You are Logged out\n"); goto logout;
                    default: printf("Invalid choice.\n");
                }
            }
            logout:;
        } else printf("Invalid option! Enter 1 or 2.\n");
    }
}
